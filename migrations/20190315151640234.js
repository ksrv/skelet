export default {
  async up (getConnection) {
    const connection = await getConnection('MASTER');
    const sql = `
      CREATE TABLE temp (
        id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
        field VARCHAR (255) NOT NULL DEFAULT ''
      )
    `;
    await connection.query(sql);
    return connection;
  },

  async down (getConnection) {
    const connection = await getConnection('MASTER');
    const sql = 'DROP TABLE temp';
    await connection.query(sql);
    return connection;
  }
}