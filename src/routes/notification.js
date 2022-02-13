const express = require('express');
const router = express.Router();
const pool = require('./../database');

/**
 * Metodo post para mostrar notificacion de tarea asignaada a un usuario
 * Se especifica el id de la tarea asignada al usuario
 * Declaramos la ruta
 * Se especifica el mensaje de notificacion
 *
 * @param {Number} tarea_asignada_id
 * @param {String} notificacion
 */

router.post('/', async (req, res, next) => {
  // Usamos un try-catch para capturar posibles errores al momento de mandar las consultas
  try {
    // Especificamos que uaremos un objeto para poder enviar una consulta.
    // Especificamos que la consulta se hara con un body.
    const { tarea_asignada_id, notificacion } = req.body;
    // Hacemos la consulta a base de datos mediante el pool pasando como parametros el objeto creado lineas arriba
    await pool.query('CALL notificacion_curso (?, ?) ', [
      tarea_asignada_id,
      notificacion,
    ]);
    // Guardamos el resultado de otra consulta para mostrarlo como mensaje de salida
    const savedCourseUser = await pool.query(
      'select * from  tarea_asignada where tarea_asignada_id = ? ',
      tarea_asignada_id
    );
    // Se muestra la respuesta exitosa a la consulta
    res.status(200).json(savedCourseUser);
    //Manejo de errror
    //EMpezamos con el catch
  } catch (err) {
    //Envio a middleware
    next(err);
  }
});

/**
 * Metodo get para listar los cursos con solicitud de acceso que tiene un profesor
 * Declaramos la ruta
 * Se especifica el id del usuario profesor quien creo los cursos con solcicitud de acceso
 * @param {Number} usuario_id
 */
router.get('/profesor/:usuario_id', async (req, res, next) => {
  // Especificamos que usaremos un objeto para poder enviar una consulta.
  // Especificamos que la consulta se hara con un oarametro.
  const { usuario_id } = req.params;
  // Hacemos la consulta a base de datos mediante el pool pasando como parametros el objeto creado lineas arriba
  await pool.query('CALL listarCursosConSolicicitudAcceso (?) ', [usuario_id]);
  // Guardamos el resultado de otra consulta para mostrarlo como mensaje de salida
  const listaCursosConSolicicitudAcceso = await pool.query(
    'CALL listarCursosConSolicicitudAcceso (?)  ',
    usuario_id
  );
  // Se muestra la respuesta exitosa a la consulta
  res.status(200).json(listaCursosConSolicicitudAcceso);
});

/**
 * Metodo get para listar los cursos con solicitud de acceso que tiene un alumno
 * Declaramos la ruta
 * Se especifica el id del usuario alumno quien tiene cursos con solicitud de acceso
 * @param {Number} usuario_id
 */
router.get('/alumno/:usuario_id', async (req, res, next) => {
  // Especificamos que usaremos un objeto para poder enviar una consulta.
  // Especificamos que la consulta se hara con un oarametro.
  const { usuario_id } = req.params;
  // Hacemos la consulta a base de datos mediante el pool pasando como parametros el objeto creado lineas arriba
  await pool.query('CALL listarCursosConSolicicitudAccesoParaAlumnos (?) ', [
    usuario_id,
  ]);
  // Guardamos el resultado de otra consulta para mostrarlo como mensaje de salida
  const listaCursosConSolicicitudAccesoParaAlumnos = await pool.query(
    'CALL listarCursosConSolicicitudAccesoParaAlumnos (?)  ',
    usuario_id
  );
  // Se muestra la respuesta exitosa a la consulta
  res.status(200).json(listaCursosConSolicicitudAccesoParaAlumnos);
});

/**
 * Metodo get para listar las notificaciones de un usuario
 * Declaramos la ruta
 * Se especifica el id del usuario del cual queremos listar sus notificaciones
 * @param {Number} usuario_id
 */
router.get('/:usuario_id', async (req, res, next) => {
  // Especificamos que usaremos un objeto para poder enviar una consulta.
  // Especificamos que la consulta se hara con un parametro.
  const { usuario_id } = req.params;
  // Hacemos la consulta a base de datos mediante el pool pasando como parametros el objeto creado lineas arriba
  await pool.query('CALL listarNotificacionesPorUsuario (?) ', [usuario_id]);
  // Guardamos el resultado de otra consulta para mostrarlo como mensaje de salida
  const listaNotificacionesPorUsuario = await pool.query(
    'CALL listarNotificacionesPorUsuario (?)  ',
    usuario_id
  );
  // Se muestra la respuesta exitosa a la consulta
  res.status(200).json(listaNotificacionesPorUsuario);
});

/**
 * Metodo post para aceptar la invitacion para acceder a un curso
 * Se especifica el id del usuario a quien se le manda la invitacion
 * Se especifica el id del curso al que invita al usuario
 * Declaramos la ruta
 * Se especifica el id de la situacion con la que se acepta el curso
 *
 * @param {Number} usuario_id
 * @param {Number} curso_id
 * @param {Number} situacion_id
 */
router.post('/aceptarInvitacionDeProfesor', async (req, res, next) => {
  // Especificamos que usaremos un objeto para poder enviar una consulta.
  // Especificamos que la consulta se hara con un body.
  const { usuario_id, curso_id, situacion_id } = req.body;
  // Hacemos la consulta a base de datos mediante el pool pasando como parametros el objeto creado lineas arriba
  await pool.query('CALL aceptar_invitacion_profesor (?, ?, ?) ', [
    usuario_id,
    curso_id,
    situacion_id,
  ]);
  // Guardamos el resultado de otra consulta para mostrarlo como mensaje de salida
  const cursoAceptado = await pool.query(
    'SELECT * FROM curso_usuario where curso_id = ? and usuario_id = ?',
    [usuario_id, curso_id]
  );
  // Se muestra la respuesta exitosa a la consulta
  res.status(201).json(cursoAceptado);
});

/**
 * Metodo post para aceptar la solicitud de acceso de un alumno
 * Se especifica el id del usuario quien manda la solucitud
 * Se especifica el id del curso al que se solicita acceso
 * Declaramos la ruta Se especifica el id de la situacion con la que se acepta el curso
 *
 * @param {Number} usuario_id
 * @param {Number} curso_id
 * @param {Number} situacion_id
 */
router.post('/aceptarSolicitudAcceso', async (req, res, next) => {
  // Usamos un try-catch para capturar posibles errores al momento de mandar las consultas
  try {
    // Especificamos que usaremos un objeto para poder enviar una consulta.
    // Especificamos que la consulta se hara con un body.
    const { usuario_id, curso_id, situacion_id } = req.body;
    // Hacemos la consulta a base de datos mediante el pool pasando como parametros el objeto creado lineas arriba
    await pool.query('CALL aceptarSolicitudAcceso (?, ?, ?) ', [
      usuario_id,
      curso_id,
      situacion_id,
    ]);
    // Guardamos el resultado de otra consulta para mostrarlo como mensaje de salida
    const solicitud = await pool.query(
      'CALL aceptarSolicitudAcceso (?, ?, ?) ',
      [usuario_id, curso_id, situacion_id]
    );
    // Se muestra la respuesta exitosa a la consulta
    res.status(200).json(solicitud);
  } catch (err) {
    //Envio a middleware
    next(err);
  }
});

/**
 * Aqui el query para solicitar acceso a un curso privado
 * Metodo para que el alumno pueda solicitad un notificacion al profesor que quiere unirse a su curso privado
 */
router.post('/solicitarCursoPrivado', async (req, res, next) => {
  //En caso que sea este en lo correcto
  //Empesamos con el try
  try {
    //Se solicita el id_curso y id_usuario a traves de body.
    const { curso_id, usuario_id } = req.body;

    //Se crea y se le asigna la situacion_id "3"
    let situacion_id = '3';

    //Se guarda en una variable, los datos de curso_id, usuario_id, situacion_id
    let solicitudPrivate = {
      curso_id,
      usuario_id,
      situacion_id,
    };

    //Se solicita a un query que inserte en la tabla curso_usuario los datos.
    await pool.query('INSERT INTO curso_usuario SET ? ', solicitudPrivate);

    //Se guarda en una variable constante los datos que fueron solictados en el query
    const savedSocitudPrivate = await pool.query(
      'SELECT * FROM curso_usuario WHERE curso_id = ?',
      curso_id
    );

    //Se manda en forma de json al fronted los datos encontrados en la tabla
    res.status(201).json(savedSocitudPrivate);

    //Manejo de errror
    //EMpezamos con el catch
  } catch (err) {
    //Envio a middleware
    next(err);
  }
});

/**
 * Metodo que le muestra al profesor una lista de alumnos que han mandado solicitud
 */
router.get('/AcceptarSolicitudPrivado/:idcurso', async (req, res, next) => {
  //Se solicita el id_curso a traves de enlace.
  const { idcurso } = req.params;

  //Si coloca como que la situacion_id siempre va ser 3
  const situacion_id = '3';

  //Se declara una variable
  let alumnosPendientes;
  //Se guarda en la varibale una lista de alumnos que tengan la situacion_id de 3
  alumnosPendientes = await pool.query(
    'SELECT * FROM curso_usuario WHERE curso_id = ? AND situacion_id = ?',
    [idcurso, situacion_id]
  );
  //Manda al fronted en forma de json la varible
  res.status(200).json(alumnosPendientes);
});

/**
 * Metodo para que el profesor pueda aceptar y mandar las solicitud de los cursos  Privado
 */
router.put('/AcceptarSolicitudPrivado/:idcurso', async (req, res, next) => {
  const { idcurso } = req.params;

  const { usuario_id, situacion_id } = req.body;
  // situacion_id = "1": acceptado;
  // situacion_id = "2": rechazado;

  //En caso se encuentra los datos ingresados perfectamente
  //Empesamos con el try
  try {
    //Actualizar el la situacion de los alumnos en la tabla curso_usario, dependiendo del curso y usuario.
    await pool.query(
      'UPDATE curso_usuario SET situacion_id = ? WHERE curso_id = ? AND usuario_id = ?',
      [situacion_id, idcurso, usuario_id]
    );
    //Se guarda en una variable los datos de la tabla curso_usuario depeniendo el curso_id y usuario_id.
    const aceptarsolictudPrivate = await pool.query(
      'SELECT * FROM curso_usuario WHERE curso_id = ? AND usuario_id = ?',
      [idcurso, usuario_id]
    );
    //Se manda la variable sobre como se encuentra actualizada
    //Respuesta a la peticion
    res.status(200).json(aceptarsolictudPrivate);
  } catch (err) {
    //Envio a middleware
    next(err);
  }
});

module.exports = router;
