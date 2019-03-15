import fs from 'fs';
import path from 'path';


export default class FileStorage {
  constructor () {
    this.path = path.join(process.env.PWD, 'migrations');
    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path);
    }
  }

  findAll () {
    return fs.readdirSync(this.path);
  }

  loadFile (name) {
    return require(path.join(this.path, name));
  }
}
