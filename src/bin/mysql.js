import MySqlCluster from '../lib/mysql-cluster';
import config from '../etc/mysql.json';

const { cluster, servers } = config;
const mysql = new MySqlCluster(cluster);
servers.forEach(({ name, config }) => {
  mysql.addServer(name, config);
});


export default mysql;