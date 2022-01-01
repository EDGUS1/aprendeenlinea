//Middlewares
//Framework de nodejs
const express = require('express');
//Definicion del router
const router = express.Router();
//Definicion del pool sql
const pool = require('./../database');
//Nos trae el metodo para hacer querys a la BD

//encriptacion del password
//Importamos el bycrupt
const bcrypt = require('bcrypt');
//Importamos el multer
let multer = require('multer');
//instanciamos el mutler
let upload = multer({
  limits: {
    fileSize: 8000000, // Compliant: 8MB
  },
});

//Metodo get para listar a todos los usuarios existentes
router.get('/users', async (req, res, next) => {
  //Empesamos con el try
  //Se accede a la BD y se seleciona  a todos los usuarios
  //Todos los datos se guardan en la variable list
  let list = await pool.query('SELECT * FROM usuario');
  //Respuesta a la peticion
  res.status(200).json({
    //Se devuelve la lista de usuarios al Frontend
    list,
  });

  //Manejo de errror
  //EMpezamos con el catch
});

//Metodo get para listar a un solo usuarios
router.get('/users/:id', async (req, res, next) => {
  //Parámetro id del usuario para listarlo
  const { id } = req.params;
  //Empesamos con el try
  try {
    //Se accede a la BD y se seleciona  al usuarios a través de su id única
    //Los datos del usuario se guarda en la variable user
    let user = await pool.query('SELECT * FROM usuario WHERE usuario_id = ?', [
      id,
    ]);
    let cursos = await pool.query(
      'SELECT * FROM curso WHERE privacidad_id = 1 AND usuario_id = ?',
      [id]
    );
    let idcursos = cursos.map(curso => curso.curso_id);

    let cantidadEstudiantes = await Promise.all(
      idcursos.map(async idcur => {
        return pool.query(
          'SELECT COUNT(*) FROM curso as c JOIN curso_usuario as cu ON c.curso_id = cu.curso_id WHERE c.privacidad_id IN (1,5) AND cu.curso_id = ? GROUP BY cu.curso_id;',
          [idcur]
        );
      })
    );

    let cantidadTotal = cantidadEstudiantes.map(can =>
      can.length > 0 ? Object.values(can[0])[0] : 0
    );
    let suma = cantidadTotal.reduce((a, b) => a + b);

    //Respuesta a la peticion
    res.status(200).json({
      //Se devuelve el usuario al Frontend
      user,
      cantidadEstudiantes: suma,
      cantidadCursosPublicos: cursos.length,
    });

    //Manejo de errror
    //EMpezamos con el catch
  } catch (err) {
    //Envio a middleware
    next(err);
  }
});

//Metodo get para editar al usuario
router.post('/useredit/:id', upload.fields([]), async (req, res, next) => {
  //Empesamos con el try
  //Parámetro id extraido de la ruta
  const { id } = req.params;
  //Parámetros extraidos del cuerpo  enviado por el frontend
  const {
    usuario_nombre,
    usuario_apellido_paterno,
    usuario_imagen,
    usuario_descripcion,
  } = req.body;
  //Constante newUser user donde se guardan los parámetros del cuerpo
  console.log(req.body);

  const newUser = {
    usuario_nombre,
    usuario_apellido_paterno,
    usuario_imagen,
    usuario_descripcion,
    usuario_fecha_modificacion: new Date(Date.now()),
  };

  //Se accede a la BD y se realiza un update a traves de la variable newUser y el parametro id
  await pool.query('UPDATE usuario set ? WHERE usuario_id = ?', [newUser, id]);

  //Se accede a la BD y se seleciona al usuario previamente updateado a través del parametro id
  //Se guardan los nuevos datos del usuario en la variable user1
  const user1 = await pool.query('SELECT * FROM usuario WHERE usuario_id = ?', [
    id,
  ]);

  //Respuesta a la peticion
  res.status(200).json({
    //Se devuelve el usuario updateado al Frontend
    user1,
  });
  //Manejo de errror
  //EMpezamos con el catch
});

//Metodo POST para crear un nuevo usuario
router.post('/register', async (req, res, next) => {
  //Parámetros necesarios para crear al nuevo usuario
  const { usuario_nombre, usuario_apellidos, password, correo, url } = req.body;

  //Si el password es nulo la data es inválida
  if (!password) {
    //Respuesta a la peticion return
    return res.status(400).json({
      //Se notifica al frontend que la data es inválida
      error: 'data invalid',
    });
  }

  //Constante para el numero de encriptaciones del password
  const saltRounds = 10;
  //Se encripta el password a través de la libreria bcrypt
  //Se guarda el password encriptado en la variable passwordHash
  const passwordHash = await bcrypt.hash(password, saltRounds);

  //Se crea la variable usuario_contrasenia con el password previamente encriptado
  const usuario_contrasenia = passwordHash;

  //se crear la variable newUser con los campos necesarios para guardarla en la BD
  let newUser = {
    usuario_nombre,
    usuario_apellido_paterno: usuario_apellidos,
    usuario_contrasenia,
    usuario_correo: correo,
    usuario_imagen: null,
  };

  //Empesamos con el try
  try {
    //Se accede a la BD y se inserta o guarda al muevo usuario
    await pool.query('INSERT INTO usuario set ? ', newUser);

    //Se accede a la BD y se seleciona al usuario de previamente creado a través del usuario_nombre
    //Se guardan los datos usuario en la variable usuario
    const usuario = await pool.query(
      'SELECT * FROM usuario WHERE usuario_nombre = ?',
      [newUser.usuario_nombre]
    );
    //Se devuelve el usuario creado al Frontend
    //Respuesta a la peticion
    res.status(201).json(usuario[0]);
  } catch (e) {
    //Se maneja los errores en caso de haberlo
    //Respuesta a la peticion
    next(e);
  }
});

module.exports = router;
