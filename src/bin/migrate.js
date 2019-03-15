import commander from 'commander';
import chalk from 'chalk';
import cluster  from './mysql';
import Migrator from '../lib/mysql-migration';


commander
  .command('create [server] [name...]')
  .description('Create new migration file')
  .action(async (server, names) => {
    if (typeof server === 'undefined') {
      console.log(chalk.red('Migration server must be defined'));
      return;
    }
    if (names.length == 0) {
      console.log(chalk.red('Migration file name not defined'));
      return;
    }
    try {
      const connection = await cluster.getConnection(server);
      const migrator = new Migrator(connection);
      const filename = migrator.create(names.join('-'));
      console.log(chalk.green(`Migration file created - "${ filename}"`));
      process.exit(0);
    } catch (error) {
      console.error(error);
      process.exit(1);
    } finally {
      connection.release();
    }
  });

commander
  .command('up [server] [count]')
  .description('Migrate up [count]. Default up all new migration.')
  .action(async (server, count) => {
    if (typeof server === 'undefined') {
      console.log(chalk.red('Migration server must be defined'));
      return;
    }
    try {
      const connection = await cluster.getConnection('MASTER');
      const migrator = new Migrator(connection);
      const processed = await migrator.up(count);
      if (processed.length) {
        console.log(chalk.green('The following migrations are processed'));
        processed.forEach(name => console.log(name));
        console.log('');
      }
      process.exit(0);
    } catch (error) {
      console.error(error);
      process.exit(1);
    } finally {
      connection.release();
    }
  });

commander
  .command('down [server] [count]')
  .description('Migrate down [count]. Default down 1 migration.')
  .action(async (server, count) => {
    if (typeof server === 'undefined') {
      console.log(chalk.red('Migration server must be defined'));
      return;
    }
    try {
      const connection = await cluster.getConnection('MASTER');
      const migrator = new Migrator(connection);
      const processed = await migrator.down(count);
      if (processed.length) {
        console.log(chalk.green('The following migrations are processed'));
        processed.forEach(name => console.log(name));
        console.log('');
      }
      process.exit(0);
    } catch (error) {
      console.error(error);
      process.exit(1);
    } finally {
      connection.release();
    }
  });

commander
  .parse(process.argv);
