//IMportamos la libreria mysql
const mysql = require('mysql');
//Delcaramos el pormisify
const { promisify } = require('util');
//Traemos la credenciales del keys
const { database } = require('./keys');
//Creamos el pool
const pool = mysql.createPool(database);
//Se crea la connecion
pool.getConnection((err, connection) => {
  //Codicional de la coneccion
  if (connection) connection.release();
  //Return dela conexion
  return true;
});

// Promisify Pool Querys
pool.query = promisify(pool.query);
//Se exporta el pool
module.exports = pool;
