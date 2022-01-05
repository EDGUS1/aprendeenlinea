//Framework de nodejs
const express = require('express');
//Defi//Definicion de la rutanicion del router//Definicion de la ruta
const router = express.Router();
//Definicion del pool sql
const pool = require('./../database');
//Nos trae el metodo para hacer querys a la BD
//Definicion de la ruta
router.post('/creartarea', async (req, res, next) => {
  //Esta es la ruta para crear una nueva tarea

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
    //Se llama al procedimiento
    // await pool.query('CALL asignartareas(?, ?);', [
    //   curso_id,
    //   tareaCreated.insertId,
    // ]);
    //Respuesta a la peticion
    res.status(200).json({
      msg: 'tarea creada',
      tarea: tareaCreated,
    });

    //Manejo de errror
    //EMpezamos con el catch
  } catch (err) {
    //Envio a middleware
    next(err);
  }
});

//Definicion de la ruta
router.put('/editarTarea/:idTarea', async (req, res, next) => {
  //MEtodo para editar tarea
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
    //Manejo de errror
    //EMpezamos con el catch
  } catch (err) {
    //Envio a middleware
    next(err);
  }
});

//Definicion de la ruta//Metodo para subir archivos
router.post('/subirArchivo', async (req, res, next) => {
  //Obrenemos los dartos del cuertpo de la petcion
  const { archivo_id, origen_id, url, nombre_archivo, tipo } = req.body;
  //Se crea un json para el nuevo archivo
  console.log(req.body);
  const newArchivo = {
    archivo_id,
    origen_id,
    url,
    nombre_archivo,
    tipo,
  };

  //Empesamos con el try
  try {
    //Aqui va el query para crear una nueva tarea
    await pool.query('INSERT INTO archivo set ? ', newArchivo);

    //Respuesta a la peticion
    res.status(200).json({
      msg: 'Archivo subido',
    });

    //Manejo de errror
    //EMpezamos con el catch
  } catch (err) {
    //Envio a middleware
    next(err);
  }
});
//Definicion de la ruta
router.get('/mostrarArchivo/:id_archivo', async (req, res, next) => {
  //Empesamos con el try
  // Obtenemos el id de los archivos de los parametros de la ruta de la peticion
  const { id_archivo } = req.params;

  // Se accede a la BD para listar un solo Archivo
  let list = await pool.query('SELECT * FROM archivo WHERE archivo_id = ?', [
    id_archivo,
  ]);
  //Respuesta a la peticion
  res.status(200).json({
    list,
  });
  //Manejo de errror
  //EMpezamos con el catch
});

//Definicion de la ruta
router.get('/listarTareasCurso/:idcurso', async (req, res, next) => {
  const { idcurso } = req.params;

  //Empesamos con el try
  //Aqui va el query para crear una nueva tarea
  const tareas = await pool.query('SELECT * FROM tarea WHERE curso_id = ? ', [
    idcurso,
  ]);
  // console.log(tareas)
  //Respuesta a la peticion
  res.status(200).json({
    tareas,
    msg: `Tareas del curso: ${idcurso} listadas`,
  });

  //Manejo de errror
  //EMpezamos con el catch
});

//Exportacion del roiter
module.exports = router;
