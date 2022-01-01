//Framework de nodejs
const express = require('express');
//Definicion del router
const router = express.Router();
//Definicion del pool sql
const pool = require('./../database');
//Nos trae el metodo para hacer querys a la BD
//importamos el generador de codigo para cursos
var CodeGenerator = require('node-code-generator');
//NOs craara un codigo segun un patron
//INsatanciamos el generador
var generator = new CodeGenerator();
//Declaramos el patron
var pattern = '***#**##';
//Este patron se usara para crear el codigo

//Declaramos la ruta
router.get('/cursos/:iduser', async (req, res, next) => {
  // Esta es la ruta para obtener los cursos de un usuario

  // Obtenemos el id del usuario de los parametros de la ruta de la peticion
  const { iduser } = req.params;
  //Empesamos con el try

  //Declaramos la variable list
  let list;

  // Aqui va el query de buscar los cursos de un usuario
  list = await pool.query('SELECT * FROM curso WHERE usuario_id = ?', [iduser]);
  // Respuesta a la peticion
  res.status(200).json({
    list,
  });
  //Manejo de errror
  //EMpezamos con el catch
});
//Declaramos la ruta
//Declaramos la ruta
router.get('/courses/:id', async (req, res, next) => {
  // Esta es la ruta para obtener la informacion de un curso

  // Obtenemos el id del usuario de los parametros de la ruta de la peticion
  const { id } = req.params;

  // Aqui va el query para obtener un curso especifico por su id
  const course = await pool.query('SELECT * FROM curso WHERE curso_id = ?', [
    id,
  ]);
  // Aqui va el query para obtener un alumno especifico por su id
  const alumnos = await pool.query(
    'SELECT COUNT(*) FROM curso_usuario WHERE curso_id = ? and situacion_id = 1',
    [id]
  );
  // Respuesta a la peticion
  res.status(200).json({
    data: course[0],
    alumnos: Object.values(alumnos[0])[0],
  });
  //Manejo de errror
  //EMpezamos con el catch
});
//Declaramos la ruta
router.post('/courses', async (req, res, next) => {
  // Esta es la ruta para crear un curso

  // Obtenemos los datos del cuerpo de la peticion
  const {
    curso_id,
    usuario_id,
    categoria_id,
    imagen,
    curso_nombre,
    descripcion,
    conoci_previo,
    privacidad_id,
    curso_fecha_creacion,
  } = req.body;
  //Creamos el codigo para generar
  var code = generator.generateCodes(pattern, 1, {});
  //Creamo un json para el nuevo curso
  let newCourse = {
    curso_id,
    usuario_id,
    categoria_id,
    curso_codigo: code,
    curso_imagen: imagen,
    curso_nombre,
    curso_descripcion: descripcion,
    curso_conoci_prev: conoci_previo,
    privacidad_id,
  };

  // Aqui va el query para guardar un curso
  await pool.query('INSERT INTO curso SET ? ', newCourse);
  //const savedCourse = await pool.query('SELECT * FROM cursos WHERE curso_nombre = ?', [curso_nombre])

  // Respuesta a la peticion
  res.status(201).json({
    msg: 'Curso creado',
  }); // Aca se debe de enviar el nuevo curso creado
  //Manejo de errror
  //EMpezamos con el catch
});

/**
 * @param {Number} curso_id
 * @param {String} correo
 * @param {Boolean} error
 * @param {String} mensaje
 */
// Metodo post para agregar un alumno a un curso.
// Se especifica el id del curso al que se va agregar al usuario.
//Declaramos la ruta// Se especifica el correo del usuario que va unirse al curso.
router.post('/coursesUsers', async (req, res, next) => {
  // Usamos un try-catch para capturar posibles errores al momento de mandar las consultas
  try {
    // Especificamos que usaremos un objeto para poder enviar una consulta.
    // Especificamos que la consulta se hara con un body.
    const { curso_id, correo } = req.body;
    // Hacemos la consulta a base de datos mediante el pool pasando como parametros el objeto creado lineas arriba
    await pool.query('CALL crear_usuario_curso (?, ?, @error, @mensaje)', [
      curso_id,
      correo,
    ]);
    // Guardamos el resultado de otra consulta para mostrarlo como mensaje de salida
    const a = await pool.query(
      'CALL crear_usuario_curso (?, ?, @error, @mensaje)',
      [curso_id, correo]
    );
    // Prueba de la salida en consola
    console.log(a[0][0]['@mensaje']);
    // Se muestra la respuesta exitosa a la consulta y los mensajes de salida del procedimiento almacenado
    res.status(201).json({
      error: a[0][0]['@error'],
      msg: a[0][0]['@mensaje'],
    });
    //Manejo de errror
    //EMpezamos con el catch
  } catch (err) {
    //Envio a middleware
    next(err);
  }
});
//Declaramos la ruta
router.post('/deletecoursesUsers', async (req, res, next) => {
  // Ruta para eliminar un usuario a un curso
  try {
    //Obtenemos los datos del cuerpo ed la peticion
    const { curso_id, usuario_id } = req.body;
    // Creamos el query para traeros la informacion de la bd
    await pool.query(
      `DELETE FROM curso_usuario WHERE curso_id = ${curso_id} AND usuario_id = ${usuario_id}`
    );
    // await pool.query('CALL crear_usuario_curso (?, ?, @error, @mensaje)', [curso_id, correo])
    // const a = await pool.query('CALL crear_usuario_curso (?, ?, @error, @mensaje)', [curso_id, correo])
    // console.log(a[0][0]['@mensaje'])
    res.status(201).json({
      msg: 'Usuario eliminado del curso',
    });
    //Manejo de errror
    //EMpezamos con el catch
  } catch (err) {
    //Envio a middleware
    next(err);
  }
});

/**
 * @param {Number} tarea_asignada_id
 * @param {String} notificacion
 */
// Metodo post para mostrar notificacion de tarea asignaada a un usuario
// Se especifica el id de la tarea asignada al usuario.
//Declaramos la ruta// Se especifica el mensaje de notificacion
router.post('/notificacion', async (req, res, next) => {
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
 * @param {Number} usuario_id
 * @param {Number} curso_id
 * @param {Number} situacion_id
 */
// Metodo post para aceptar la solicitud de acceso de un alumno
// Se especifica el id del usuario quien manda la solucitud
// Se especifica el id del curso al que se solicita acceso
//Declaramos la ruta// Se especifica el id de la situacion con la que se acepta el curso
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
    //Manejo de errror
    //EMpezamos con el catch
  } catch (err) {
    //Envio a middleware
    next(err);
  }
});

/**
 * @param {String} codigo
 * @param {Number} usuario_id
 */
// Metodo post para unirse a un curso mediante un codigo
// Se especifica el codigo del curso a acceder
//Declaramos la ruta// Se especifica el id del usuario que se unira al curso
router.post('/unirPorCodigo', async (req, res, next) => {
  // Usamos un try-catch para capturar posibles errores al momento de mandar las consultas
  try {
    // Especificamos que usaremos un objeto para poder enviar una consulta.
    // Especificamos que la consulta se hara con un body.
    const { codigo, usuario_id } = req.body;
    // Hacemos la consulta a base de datos mediante el pool pasando como parametros el objeto creado lineas arriba
    await pool.query('CALL unirseCursoPorCodigo (?, ?, @error, @mensaje)', [
      codigo,
      usuario_id,
    ]);
    // Guardamos el resultado de otra consulta para mostrarlo como mensaje de salida
    const a = await pool.query(
      'CALL unirseCursoPorCodigo (?, ?, @error, @mensaje)',
      [codigo, usuario_id]
    );
    // Prueba de la salida en consola
    console.log(a[0][0]['@mensaje']);
    // Se muestra la respuesta exitosa a la consulta y los mensajes de salida del procedimiento almacenado
    res.status(201).json({
      error: a[0][0]['@error'],
      msg: a[0][0]['@mensaje'],
    });
    //Manejo de errror
    //EMpezamos con el catch
  } catch (err) {
    //Envio a middleware
    next(err);
  }
});

/**
 * @param {Number} usuario_id
 */
// Metodo get para listar los cursos agregados por un profesor
//Declaramos la ruta// Se especifica el id del usuario profesor quien agrego alumnos a su curso
router.get(
  '/listarCursosAgregadosPorProfesor/:usuario_id',
  async (req, res, next) => {
    // Usamos un try-catch para capturar posibles errores al momento de mandar las consultas
    // Especificamos que usaremos un objeto para poder enviar una consulta.
    // Especificamos que la consulta se hara con un body.
    const { usuario_id } = req.params;
    // Hacemos la consulta a base de datos mediante el pool pasando como parametros el objeto creado lineas arriba
    await pool.query('CALL listarCursosAgregadosPorProfesor (?) ', [
      usuario_id,
    ]);
    // Guardamos el resultado de otra consulta para mostrarlo como mensaje de salida
    const listaCursosAgregadosPorProfesor = await pool.query(
      'CALL listarCursosAgregadosPorProfesor (?)  ',
      usuario_id
    );
    // Se muestra la respuesta exitosa a la consulta
    res.status(200).json(listaCursosAgregadosPorProfesor);
    //Manejo de errror
    //EMpezamos con el catch
  }
);

/**
 * @param {Number} usuario_id
 */
// Metodo get para listar los cursos con solicitud de acceso que tiene un profesor
//Declaramos la ruta// Se especifica el id del usuario profesor quien creo los cursos con solcicitud de acceso
router.get(
  '/listarCursosConSolicicitudAcceso/:usuario_id',
  async (req, res, next) => {
    // Usamos un try-catch para capturar posibles errores al momento de mandar las consultas
    // Especificamos que usaremos un objeto para poder enviar una consulta.
    // Especificamos que la consulta se hara con un oarametro.
    const { usuario_id } = req.params;
    // Hacemos la consulta a base de datos mediante el pool pasando como parametros el objeto creado lineas arriba
    await pool.query('CALL listarCursosConSolicicitudAcceso (?) ', [
      usuario_id,
    ]);
    // Guardamos el resultado de otra consulta para mostrarlo como mensaje de salida
    const listaCursosConSolicicitudAcceso = await pool.query(
      'CALL listarCursosConSolicicitudAcceso (?)  ',
      usuario_id
    );
    // Se muestra la respuesta exitosa a la consulta
    res.status(200).json(listaCursosConSolicicitudAcceso);
    //Manejo de errror
    //EMpezamos con el catch
  }
);

/**
 * @param {Number} usuario_id
 */
// Metodo get para listar los cursos con solicitud de acceso que tiene un alumno
//Declaramos la ruta// Se especifica el id del usuario alumno quien tiene cursos con solicitud de acceso
router.get(
  '/listarCursosConSolicicitudAccesoParaAlumnos/:usuario_id',
  async (req, res, next) => {
    // Usamos un try-catch para capturar posibles errores al momento de mandar las consultas
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
    //Manejo de errror
    //EMpezamos con el catch
  }
);

/**
 * @param {Number} usuario_id
 */
// Metodo get para listar las notificaciones de un usuario
//Declaramos la ruta// Se especifica el id del usuario del cual queremos listar sus notificaciones
router.get(
  '/listarNotificacionesPorUsuario/:usuario_id',
  async (req, res, next) => {
    // Usamos un try-catch para capturar posibles errores al momento de mandar las consultas
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
    //Manejo de errror
    //EMpezamos con el catch
  }
);

/**
 * @param {Number} usuario_id
 * @param {Number} curso_id
 * @param {Number} situacion_id
 */
// Metodo post para aceptar la invitacion para acceder a un curso
// Se especifica el id del usuario a quien se le manda la invitacion
// Se especifica el id del curso al que invita al usuario
//Declaramos la ruta// Se especifica el id de la situacion con la que se acepta el curso
router.post('/aceptarInvitacionDeProfesor', async (req, res, next) => {
  // Usamos un try-catch para capturar posibles errores al momento de mandar las consultas
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
  //Manejo de errror
  //EMpezamos con el catch
});

//Declaramos la ruta
router.get('/course-user/:idcurso', async (req, res, next) => {
  // Ruta para obtener la lista de usuarios de un curso

  //Obtenemos el id del curso de los parametros de la ruta de la peticion
  const { idcurso } = req.params;
  //Empesamos con el try

  //Aqui va el query para obtener la lista de usuarios de un curso
  let listUser = await pool.query('CALL listarUsuariosPorCurso(?);', [idcurso]);
  //Respuesta a la peticion
  res.status(200).json({
    message: 'Lista del curso: ' + idcurso,
    data: listUser,
  });
  //Manejo de errror
  //EMpezamos con el catch
});
//Declaramos la ruta
router.get('/coursesofuser/:iduser', async (req, res, next) => {
  // Ruta para obtener la lista de cursos de un usuario

  // Obtenemos el id del usuario de los parametros de la ruta de la peticion
  const { iduser } = req.params;

  //Empesamos con el try
  // Aqui va el query para obtener la lista de cursos de un usuario

  let listUser = await pool.query(
    `
    SELECT c.*
    FROM curso_usuario AS cu 
    INNER JOIN curso AS c 
    ON cu.curso_id = c.curso_id 
    WHERE cu.usuario_id = ?
    `,
    [iduser]
  );

  // Respuesta a la peticion
  res.status(200).json({
    message: 'Lista de cursos del usuario: ' + iduser,
    data: listUser,
  });
  //Manejo de errror
  //EMpezamos con el catch
});
//Declaramos la ruta
router.get('/coursespublic', async (req, res, next) => {
  // Ruta para obtener la lista de cursos publicos
  //Empesamos con el try
  // Query para obtener la lista de cursos publicos
  let cursos = await pool.query('SELECT * FROM curso');
  //Obtenemos la cantidad de cursos
  let cantCursos = await pool.query('SELECT count(curso_id) FROM curso');
  // Respuesta a la peticion
  res.status(200).json({
    cursos,
    cantidad: cantCursos,
  });
  //Manejo de errror
  //EMpezamos con el catch
});
//Declaramos la ruta
router.get('/coursespublicmax', async (req, res, next) => {
  // Ruta para obtener la lista de cursos publicos
  //Empesamos con el try
  // Query para obtener la lista de cursos publicos
  let cursos = await pool.query(
    'SELECT c.* FROM curso as c JOIN curso_usuario as cu ON c.curso_id = cu.curso_id WHERE c.privacidad_id IN (1,5) GROUP BY c.curso_id ORDER BY COUNT(*) DESC LIMIT 4;'
  );
  // Respuesta a la peticion
  res.status(200).json({
    cursos,
  });
  //Manejo de errror
  //EMpezamos con el catch
});
//Declaramos la ruta
router.get('/coursespublic/:iduser', async (req, res, next) => {
  // Ruta para obtener la lista de cursos publicos de un usuario

  // Obtenemos el id del usuario de los parametros de la ruta de la peticion
  const { iduser } = req.params;
  //Empesamos con el try
  // Query para obtener la lista de cursos publicos de un usuario
  let cursos = await pool.query(
    'SELECT * FROM curso WHERE privacidad_id = 1 AND usuario_id = ?',
    [iduser]
  );
  // Respuesta a la peticion
  res.status(200).json({
    cursos,
  });
  //Manejo de errror
  //EMpezamos con el catch
});
//Declaramos la ruta
router.post('/coursesEdit/:idcurso', async (req, res, next) => {
  // Ruta para actualizar los datos de un curso

  //Empesamos con el try
  try {
    // Obtenemos el id del curso de los parametros de la ruta de la peticion
    const { idcurso } = req.params;
    // Obtenemos los datos del cuerpo de la peticion

    const {
      codigo,
      imagen,
      curso_nombre,
      descripcion,
      conoci_previo,
      privacidad_id,
      categoria_id,
    } = req.body;
    //Jsin para el nuevo curso
    const newCourse = {
      codigo,
      imagen,
      curso_nombre,
      descripcion,
      conoci_previo,
      privacidad_id,
      categoria_id,
    };
    // Aqui va el query para editar un curso
    await pool.query('UPDATE curso set ? WHERE curso_id = ?', [
      newCourse,
      idcurso,
    ]);
    //variable para tener los cursos de la bd
    let list = await pool.query('SELECT * FROM curso WHERE curso_id = ?', [
      idcurso,
    ]);

    // Respuesta a la peticion
    res.status(201).json(list);
    //Manejo de errror
    //EMpezamos con el catch
  } catch (err) {
    //Envio a middleware
    next(err);
  }
});
//Declaramos la ruta
router.post('/course-material/:idcurso', async (req, res, next) => {
  // Ruta para crear un nuevo material de un curso

  //Empesamos con el try
  try {
    // Obtenemos el id del curso de los parametros de la ruta de la peticion
    const { idcurso } = req.params;

    // Obtenemos los datos del cuerpo de la peticion

    const { nombre, descripcion, fecha_creacion } = req.body;
    //Creamos una variable para el idcurso
    let curso_id = idcurso;
    //Creamos un json para el nuevo material
    const newMaterial = {
      nombre,
      descripcion,
      fecha_creacion,
      curso_id,
    };
    // Aqui va el query para guardar un nuevo material de un curso
    await pool.query('INSERT INTO material SET ? ', newMaterial);
    //Variable para obtener los materiales
    let list = await pool.query('SELECT * FROM material WHERE curso_id = ?', [
      idcurso,
    ]);

    // Respuesta a la peticion
    res.status(201).json(list);
    //Manejo de errror
    //EMpezamos con el catch
  } catch (err) {
    //Envio a middleware
    next(err);
  }
});
//Declaramos la ruta
router.get('/list-task/:idcurso', async (req, res, next) => {
  // Ruta para listar las tareas de un curso

  //Empesamos con el try
  // Obtenemos el id del curso de los parametros de la ruta de la peticion
  const { idcurso } = req.params;

  // Aqui va el query para listar las tareas de un curso
  let list = await pool.query('SELECT * FROM tareas WHERE curso_id = ?', [
    idcurso,
  ]);

  // Respuesta a la peticion
  res.status(200).json(list);
  //Manejo de errror
  //EMpezamos con el catch
});
//Declaramos la ruta
router.post('/solicitarCursoPrivado', async (req, res, next) => {
  // Aqui el query para solicitar acceso a un curso privado
  //Metodo para que el alumno pueda solicitad un notificacion al profesor que quiere unirse a su curso privado

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
//Declaramos la ruta
router.get('/AcceptarSolicitudPrivado/:idcurso', async (req, res, next) => {
  //Metodo que le muestra al profesor una lista de alumnos que han mandado solicitud

  //Se solicita el id_curso a traves de enlace.
  const { idcurso } = req.params;

  //Si coloca como que la situacion_id siempre va ser 3
  const situacion_id = '3';

  //En caso que sea correcto
  //Empesamos con el try
  //Se declara una variable
  let alumnosPendientes;
  //Se guarda en la varibale una lista de alumnos que tengan la situacion_id de 3
  alumnosPendientes = await pool.query(
    'SELECT * FROM curso_usuario WHERE curso_id = ? AND situacion_id = ?',
    [idcurso, situacion_id]
  );
  //Manda al fronted en forma de json la varible
  res.status(200).json(alumnosPendientes);
  //Manejo de errror
  //EMpezamos con el catch
});
//Declaramos la ruta
router.put('/AcceptarSolicitudPrivado/:idcurso', async (req, res, next) => {
  //Metodo para que el profesor pueda aceptar y mandar las solicitud de los cursos  Privado
  const { idcurso } = req.params;
  // console.log(idcurso)

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
    //Manejo de errror
    //EMpezamos con el catch
  } catch (err) {
    //Envio a middleware
    next(err);
  }
});

//Declaramos la ruta
router.post('/join-public-course/:idcurso', async (req, res, next) => {
  //Obtenemos los datos del parametros
  const { idcurso } = req.params;
  //Obtenemos datos del cuerpo de la pericino
  const { iduser } = req.body;

  //Empesamos con el try
  try {
    //Query para los cursos
    const curso = await pool.query('SELECT * FROM curso WHERE curso_id = ?', [
      idcurso,
    ]);
    //Se declara la pribacidad
    const privacidad_publico = '1';
    //Se declara la situacin
    const situacion = '1';
    //Se crea el json para el nuevo usuario
    const newUser = {
      curso_id: idcurso,
      usuario_id: iduser,
      situacion_id: situacion,
    };
    //se declara la existencia
    var existe = '';
    //Condicional para comprobar la privacidad
    if (curso[0].privacidad_id == privacidad_publico) {
      //Query para traer los cursos
      const curso_usuario = await pool.query(
        'SELECT * FROM curso_usuario WHERE usuario_id = ?',
        [iduser]
      );
      //Creamos un ciclo para el cursos:uduario
      for (let i in curso_usuario) {
        //Condicioal
        if (
          curso_usuario[Number(i)].curso_id == idcurso &&
          curso_usuario[Number(i)].usuario_id == iduser
        ) {
          //Existencia
          existe = 'existe';
          //Salimos del bucle
          break;
        }
      }
      //Condicional de existencia
      if (existe != 'existe') {
        //Query para traer los cursos
        await pool.query('INSERT INTO curso_usuario SET ? ', newUser);
        //Respouesta a la peticion
        res.status(200).json('usuaio unido al curso Publico');
        //Else de la condicional
      } else {
        //Respiesta a la perticion
        res.status(200).json('usuario ya existe');
      }
    }
    //Manejo de errror
    //EMpezamos con el catch
  } catch (err) {
    //Envio a middleware
    next(err);
  }
});
//Declaramos la ruta
router.get('/list-task-submissions/:idtarea', async (req, res, next) => {
  // Obtenemos los datos de los parametros
  const { idtarea } = req.params;
  //Empesamos con el try
  // Aqui va el query
  const listaTareas = await pool.query(
    'SELECT ta.tarea_id, ta.usuario_id, ta.url, ta.fecha_entrega, u.usuario_nombre, u.usuario_apellidos FROM tarea_asignada ta  INNER JOIN usuarios u ON ta.usuario_id = u.usuario_id   WHERE ta.tarea_id = ?',
    [idtarea]
  );
  //Respuesta a la peticion
  res.status(200).json(listaTareas);
  //Manejo de errror
  //EMpezamos con el catch
});
//Declaramos la ruta
router.get('/listMaterials/:idcurso', async (req, res, next) => {
  // Obtenemos los datos de los parametros
  const { idcurso } = req.params;
  //Empesamos con el try
  // Aqui va el query
  const listaMaterial = await pool.query(
    'SELECT * from material WHERE curso_id = ?',
    [idcurso]
  );

  //Respuesta a la peticion
  res.status(200).json(listaMaterial);
  //Manejo de errror
  //EMpezamos con el catch
});
//Declaramos la ruta
router.post('/entregarTarea', async (req, res, next) => {
  // Obtenemos los datos del cuerpo de la peticion
  const { tarea_asignada_id, usuario_id, url } = req.body;
  //Empesamos con el try
  try {
    // Aqui va el query
    await pool.query(
      'UPDATE tarea_asignada set ? WHERE usuario_id = ? AND tarea_asignada_id = ?',
      [{ url }, usuario_id, tarea_asignada_id]
    );
    //Respuesta a la peticion
    res.status(200).json({
      msg: 'tarea entragasa',
    });
    //Manejo de errror
    //EMpezamos con el catch
  } catch (err) {
    //Envio a middleware
    next(err);
  }
});

module.exports = router;
