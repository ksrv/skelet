export default class DataStorage {
  async isExistsTable (connection) {
    const sql = 'SHOW TABLES';
    const results = await connection.query(sql);
    return !!results.find(record => record.Tables_in_srvs == 'migrations');
  }

  async createTable (connection) {
    const sql = `
      CREATE TABLE migrations (
        id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name varchar (255),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    await connection.query(sql);
  }

  async mayBeCreateTable (connection) {
    const tableExists = await this.isExistsTable(connection);
    if (!tableExists) await this.createTable(connection);
  }

  async findAll (connection) {
    const sql = 'SELECT name FROM migrations';
    const results = await connection.query(sql);
    return results;
  }
  
  async add (connection, name) {
    const sql = 'INSERT INTO migrations SET ?';
    const values = [{ name }];
    const results = await connection.query({ sql, values });
    return results;
  }
  
  async remove (connection, name) {
    const sql = 'DELETE FROM migrations WHERE name = ?';
    const values = [{ name }];
    const results = await connection.query({ sql, values });
    return results;
  }
}