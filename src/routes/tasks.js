//Framework de nodejs
const express = require('express');
//Defi//Definicion de la rutanicion del router//Definicion de la ruta
const router = express.Router();
//Definicion del pool sql
const pool = require('./../database');
//Nos trae el metodo para hacer querys a la BD

/**
 * Esta es la ruta para crear una nueva tarea
 */
router.post('/', async (req, res, next) => {
  //Obtenemos los datos de la nueva tarea del cuerpo de la peticion
  const { curso_id, tarea_nombre, tarea_descripcion, tarea_fecha_entrega } =
    req.body;
  //Se crea un json para la nbuevas tarea
  const newTarea = {
    curso_id,
    tarea_nombre,
    tarea_descripcion,
    tarea_fecha_entrega,
  };

  //Empesamos con el try
  try {
    //Aqui va el query para crear una nueva tarea
    const tareaCreated = await pool.query('INSERT INTO tarea set ? ', newTarea);

    //Respuesta a la peticion
    res.status(200).json({
      msg: 'Tarea creada',
      tarea: tareaCreated,
    });
  } catch (err) {
    //Envio a middleware
    next(err);
  }
});

/**
 * Método para editar tarea
 */
router.put('/:idTarea', async (req, res, next) => {
  const { idTarea } = req.params;
  //Obtenemos los datos del cuerpo de la peticion
  const {
    curso_id,
    nombre,
    descripcion,
    tarea_fecha_creacion,
    tarea_fecha_entrega,
    imagen,
    enlace,
  } = req.body;

  //Empesamos con el try
  try {
    //guarda los datos de ediccion
    await pool.query(
      'UPDATE tarea SET nombre = ?, descripcion = ?, tarea_fecha_creacion = ?, tarea_fecha_entrega = ?, imagen = ?, enlace = ? WHERE tarea_id = ? AND curso_id = ?',
      [
        nombre,
        descripcion,
        tarea_fecha_creacion,
        tarea_fecha_entrega,
        imagen,
        enlace,
        idTarea,
        curso_id,
      ]
    );
    //Obtentemoes la tarea editada
    const TareaEditada = await pool.query(
      'SELECT * FROM tarea WHERE tarea_id = ? AND curso_id = ?',
      [idTarea, curso_id]
    );
    //Envia los datos de la ediccion de como quedo al fronted
    res.status(200).json(TareaEditada);
  } catch (err) {
    //Envio a middleware
    next(err);
  }
});

/**
 * Método para listar tareas por curso
 */
router.get('/:idcurso', async (req, res, next) => {
  const { idcurso } = req.params;

  //Aqui va el query para crear una nueva tarea
  const tareas = await pool.query('SELECT * FROM tarea WHERE curso_id = ? ', [
    idcurso,
  ]);
  //Respuesta a la peticion
  res.status(200).json(tareas);
});

/**
 * Listar entregas realizadas de las tareas
 */
router.get('/list/:idtarea', async (req, res, next) => {
  // Obtenemos los datos de los parametros
  const { idtarea } = req.params;
  // Aqui va el query
  /* const listaTareas = await pool.query(
    'SELECT ta.tarea_id, ta.usuario_id,  ta.fecha_entrega, u.usuario_nombre, u.usuario_apellido_paterno FROM tarea_asignada ta INNER JOIN usuario u ON ta.usuario_id = u.usuario_id WHERE ta.tarea_id = ?',
    [idtarea]
  ); */

  //TODO: MEJORAR SUBCONSULTA
  // query para listar solo quienes han entregado
  const listaTareas = await pool.query(
    'SELECT ta.tarea_id, ta.usuario_id, ta.fecha_entrega, u.usuario_nombre, u.usuario_apellido_paterno, (select a.archivo_url from archivo a where a.tipo_id = 3 and a.origen_id = ta.tarea_asignada_id) as arhivo_url, (select a.archivo_nombre from archivo a where a.tipo_id = 3 and a.origen_id = ta.tarea_asignada_id) as archivo_nombre FROM tarea_asignada ta INNER JOIN usuario u ON ta.usuario_id = u.usuario_id WHERE ta.tarea_id = ? ',
    [idtarea]
  );
  /* 
  SELECT ta.tarea_id, ta.usuario_id, ta.fecha_entrega, u.usuario_nombre, u.usuario_apellido_paterno, a.archivo_url, a.archivo_nombre FROM tarea_asignada ta INNER JOIN usuario u ON ta.usuario_id = u.usuario_id LEFT JOIN archivo a on ta.tarea_asignada_id = a.origen_id WHERE ta.tarea_id = ? AND a.tipo_id = 3 */

  //Respuesta a la peticion
  res.status(200).json(listaTareas);
});

/**
 * Ruta para realizar la entrega de una tarea
 */
router.post('/entregar', async (req, res, next) => {
  // Obtenemos los datos del cuerpo de la peticion
  const { tarea_id, usuario_id } = req.body;
  //Empesamos con el try
  try {
    // Aqui va el query
    /* await pool.query(
      'UPDATE tarea_asignada set ? WHERE usuario_id = ? AND tarea_asignada_id = ?',
      [{ url }, usuario_id, tarea_asignada_id]
    ); */
    const response = await pool.query(
      'INSERT INTO tarea_asignada(tarea_id, usuario_id) VALUES (?,?)',
      [tarea_id, usuario_id]
    );
    //Respuesta a la peticion
    res.status(200).json({
      msg: 'tarea entragada',
      data: response['insertId'],
    });
  } catch (err) {
    //Envio a middleware
    next(err);
  }
});

//Exportacion del roiter
module.exports = router;
