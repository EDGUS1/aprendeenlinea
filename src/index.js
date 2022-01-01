//Importamos el dotenv para las variables de entorno
require('dotenv').config();
//Se usa para poder usar las variables de entorno
//Se declara la express
const express = require('express');
//Para poder usar el framework de express
//Se crean las opciones de cors
let corsOptions = {
  //Se declara el origin
  origin: '*', // Compliant
};
//Para detectar por donde se usa la api
//Se importa el helmet
let helmet = require('helmet');
//Para la proteccion de la apio
//Se crea la app de express
let app = express(); // Compliant
//Se crea una instancia de express
//Se usa el helmet
app.use(helmet.hidePoweredBy());
//SU uso nos permite mejorar
//Se importa el cors
const cors = require('cors');
//Para manejar el uso de la api
//Se usa el cors
app.use(cors());
//Para manejar las opciones
//Se usan las urlencoded
app.use(express.urlencoded({ extended: true, limit: '8mb' }));
//Se usa el json
app.use(express.json());

//Importamos la ruta users
const users = require('./routes/users');
//Importamos la ruta login
const login = require('./routes/login');
//Importamos la ruta course
const course = require('./routes/courses');
//Importamos la ruta suggestion
const suggestions = require('./routes/suggestions');
//Importamos la ruta categories
const categories = require('./routes/categories');
//Importamos la ruta taks
const tasks = require('./routes/tasks');

//Importamos la ruta not found
const notFound = require('./middleware/notFound');
//Importamos el control de errores
const errors = require('./middleware/errors');

//Se usa la ruta login
app.use(login);
//Se usa la ruta users
app.use(users);
//Se usa la ruta course
app.use(course);
//Se usa la ruta suggestion
app.use(suggestions);
//Se usa la ruta categories
app.use(categories);
//Se usa la ruta taks
app.use(tasks);
//Se declara la ruta base
app.get('/', (req, res) => {
  //Resopuesta a la peticion
  res.status(200).json({
    gawr: 'gura',
  });
});

// Control del 404
app.use(notFound);
// Control de errores
app.use(errors);
//Se declara el puerto
const PORT = process.env.PORT || 3001;
//Condicional para el testing
if (process.env.NODE_ENV !== 'test') {
  //Se crea el escuchador
  app.listen(PORT, () => {
    //console del localhost
    console.log(`La api esta en http://localhost:${PORT}`);
  });
}
//Se exporta la app
module.exports = { app };
