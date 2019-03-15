import cluster from '../../bin/mysql';
import DataStorage from './data-storage';
import FileStorage from './file-storage';


export default class Migrator {
  constructor (connection) {
    this.connection = connection;
    this.fileStorage = new FileStorage();
    this.fileStorage.mayBeCreateDirectory();
    this.dataStorage = new DataStorage();
    this.dataStorage.mayBeCreateTable(connection);
  }

  async getUpFilenames () {
    const filenames = this.fileStorage.findAll();
    const recordnames = await this.dataStorage.findAll(this.connection);
    const diff = filenames.filter(filename => !recordnames.includes(filename));
    diff.sort();
    return diff;
  }

  async getDownFilenames () {
    const recordnames = await this.dataStorage.findAll(this.connection);
    recordnames.sort().reverse();
    return recordnames;
  }

  create (name) {
    return this.fileStorage.createMigrationFile(name);
  }

  async up (count) {
    const filenames = await this.getUpFilenames();
    count = Number(count);
    count = isNaN(count) ? filenames.length : count;
    return await this._process(count, filenames, 'up', 'add');
  }

  async down (count) {
    const filenames = await this.getDownFilenames();
    count = Number(count);
    count = isNaN(count) ? 1 : count;
    return await this._process(count, filenames, 'down', 'remove');
  }

  async _process (count, filenames, action, dbaction) {
    const processed = [];
    for (const filename of filenames) {
      const file = this.fileStorage.loadFile(filename);
      await file[action](this.connection);
      await this.dataStorage[dbaction](this.connection, filename);
      processed.push(filename);
      if (--count == 0) break;
    }
    return processed;
  }
}
