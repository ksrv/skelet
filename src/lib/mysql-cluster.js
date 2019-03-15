import util from 'util';
import mysql from 'mysql';


export default class MySqlCluster {
  constructor (config) {
    const Debug = require('debug');
    this.debug = null;
    if (Debug) this.debug = Debug('mysql');

    this.cluster = mysql.createPoolCluster(config);
    this.cluster.on('remove', (nodeId) => this.onRemoveNode(nodeId));
    this.cluster.getConnection = util.promisify(this.cluster.getConnection);
    this.cluster.end = util.promisify(this.cluster.end);
    this.log('MYSQL CLUSTER STARTED');
  }

  async close () {
    try {
      await this.cluster.end()
      this.log('MYSQL CLUSTER CLOSED');
    } catch ({ code, errno, sqlMessage, sqlState, fatal }) {
      this.log('MYSQL CLUSTER CLOSE ERROR', { code, errno, sqlMessage, sqlState, fatal });
      throw code;
    }
  }

  addServer (name, config) {
    this.cluster.add(name, config);
    this.log('MYSQL SERVER ADDED', name);
  }

  removeServer (pattern) {
    this.cluster.remove(pattern);
    this.log('MYSQL SERVER REMOVED', pattern);
  }
  
  onRemoveNode (nodeId) {
    this.log('MYSQL SERVER REMOVED', nodeId);
  }

  async getConnection (pattern) {
    try {
      const connection = await this.cluster.getConnection(pattern);
      connection.query = util.promisify(connection.query);
      connection.beginTransaction = util.promisify(connection.beginTransaction);
      connection.commit = util.promisify(connection.commit);
      connection.rollback = util.promisify(connection.rollback);
      connection.ping = util.promisify(connection.ping);
      return connection;
    } catch ({ code, errno, sqlMessage, sqlState, fatal }) {
      const error = { code, errno, sqlMessage, sqlState, fatal };
      this.log('MYSQL CONNECTION ERROR', code);
      throw error;
    }
  }

  async hasConnection (pattern) {
    const connection = await this.getConnection(pattern);
    await connection.ping();
    return true;
  }

  log (type, payload) {
    if (!this.debug) {
      return;
    }
    if (typeof type !== 'string') {
      throw new Error('MySqlCluster::log type must be a string');
    }
    if (payload && typeof payload !== 'string') {
      throw new Error('MySqlCluster::log payload must be a string');
    }
    const time = new Date().toISOString();
    if (payload) {
      this.debug('%s :: %s :: %s', time, type, payload);
    } else {
      this.debug('%s :: %s', time, type);
    }
  }  
}
