import DataStorage from './data-storage';
import FileStorage from './file-storage';


export default class Migrator {
  constructor ({ fileStorage, dataStorage }) {
    this.fileStorage = fileStorage;
    this.dataStorage = dataStorage;
  }

  async getUpFilenames () {
    // массив имен миграций в файлах
    const filenames = this.fileStorage.findAll();
    // массив имен миграций в БД
    const recordnames = await this.dataStorage.findAll();
    // разность массивов
    const diff = filenames.filter(filename => !recordnames.includes(filename));
    // возвращаем отсортированный массив
    return diff.sort();
  }

  async getDownFilenames () {
    // массив имен миграций в файлах
    const filenames = this.fileStorage.findAll();
    // массив имен миграций в БД
    const recordnames = await this.dataStorage.findAll();
    // разность массивов
    const diff = filenames.filter(filename => recordnames.includes(filename));
    // возвращаем отсортированный массив
    return diff.sort();
  }

  async _process (count, filenames, action, dbaction) {
    for (const filename of filenames) {
      const file = this.fileStorage.loadFile(filename);
      const func = this.dataStorage.cluster.getConnection;
      const connection = await file[action](func);
      if (typeof connection.query !== 'function') {
        throw new Error('Migration must return connection');
      }
      await this.dataStorage[dbaction](connection, filename);
      if (--count == 0) break;
    }
  }

  async up (count) {
    const filenames = await this.getUpFilenames();
    console.log({ filenames });
    count = Number(count);
    count = isNaN(count) ? filenames.length : count;
    await this._process(count, filenames, 'up', 'add');
  }

  async down (count) {
    const filenames = await this.getDownFilenames();
    count = Number(count);
    count = isNaN(count) ? 1 : count;
    await this._process(count, filenames, 'down', 'remove');
  }
}


async function run () {
  try {
    const fileStorage = new FileStorage();
    const dataStorage = new DataStorage();
    const migrator = new Migrator({ fileStorage, dataStorage });
    migrator.up();
  } catch (error) {
    console.error(error);
  }
}

run();