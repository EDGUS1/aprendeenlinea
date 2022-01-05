//En este archivo estan las credenciales de la BD
//Importacion del modulo
module.exports = {
  //Se declara el json databse
  database: {
    //Datos del host
    host: process.env.DB_HOST,
    //Datos del user
    user: process.env.DB_USER,
    //Datos de la contraseña
    password: process.env.DB_PASSWORD,
    //Database
    database: process.env.DB_DATABASE,
    connectionLimit: 4,
  },
};
