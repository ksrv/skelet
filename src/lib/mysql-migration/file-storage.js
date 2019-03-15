import fs from 'fs';
import path from 'path';


export default class FileStorage {
  constructor () {
    this.path = path.join(process.env.PWD, 'migrations');
  }

  mayBeCreateDirectory () {
    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path);
    }
  }

  findAll () {
    return fs.readdirSync(this.path);
  }

  loadFile (name) {
    return require(path.join(this.path, name)).default;
  }

  createMigrationFile (name) {
    const content = `
/**
 * Добавьте описание миграции.
 * 
 * Вы можете использовать методы соединения для кластера mysql.
 * Все методы соединения промисифицированы утилитой util.promisify
 * connection.query
 * connection.beginTransaction
 * connection.commit
 * connection.rollback
 * connection.ping
 * 
 * Документация по методам соединения https://www.npmjs.com/package/mysql#poolcluster
 * 
 * ВНИМАНИЕ 
 * 1. Нежелательно оборачивать код методов up, down в try... catch.
 * 2. Не освобождайте соединение (connection.release()) в коде методов.
 */
export default {
  async up (connection) {

  },
  async down (connection) {

  }
}
`;
    const time = +(new Date);
    const migration = `${ String(time) }_${ name }.js`;
    if (migration.length > 255) {
      throw new Error('Migration name too long. Support 240 characters length.');
    }
    const filename = path.join(this.path, migration);
    fs.writeFileSync(filename, content);
    return filename;
  }
}
