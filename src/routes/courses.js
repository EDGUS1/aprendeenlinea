//Framework de nodejs
const express = require('express');
//Definicion del router
const router = express.Router();
//Definicion del pool sql
const pool = require('./../database');
//importamos el generador de codigo para cursos
const CodeGenerator = require('node-code-generator');
//Instanciamos el generador
const generator = new CodeGenerator();
//Declaramos el patron
const pattern = '***#**##';

/**
 * Esta es la ruta para obtener los cursos de un usuario
 */
router.get('/user/:iduser', async (req, res, next) => {
  // Obtenemos el id del usuario de los parametros de la ruta de la peticion
  const { iduser } = req.params;

  // Aqui va el query de buscar los cursos de un usuario
  const courses = await pool.query(
    'SELECT * FROM curso WHERE usuario_id = ? UNION SELECT c.* FROM curso_usuario AS cu INNER JOIN curso AS c ON cu.curso_id = c.curso_id WHERE cu.usuario_id = ?',
    [iduser, iduser]
  );
  // Respuesta a la peticion
  res.status(200).json(courses);
});

/**
 * Esta es la ruta para crear un curso
 */
router.post('/', async (req, res, next) => {
  // Obtenemos los datos del cuerpo de la peticion
  const {
    usuario_id,
    categoria_id,
    curso_imagen,
    curso_nombre,
    curso_descripcion,
    curso_conoci_prev,
    privacidad_id,
  } = req.body;
  //Creamos el codigo para generar
  const code = generator.generateCodes(pattern, 1, {});
  //Creamo un json para el nuevo curso
  let newCourse = {
    usuario_id,
    categoria_id,
    curso_codigo: code,
    curso_imagen,
    curso_nombre,
    curso_descripcion,
    curso_conoci_prev,
    privacidad_id,
  };

  // Aqui va el query para guardar un curso
  const response = await pool.query('INSERT INTO curso SET ? ', newCourse);

  // Respuesta a la peticion
  res.status(201).json({
    msg: `Curso creado con el id: ${response.insertId}`,
  });
});

/**
 * Metodo post para agregar un alumno a un curso.
 * Se especifica el id delcurso al que se va agregar al usuario.
 * Declaramos la ruta
 * Se especifica el correo del usuario que va unirse al curso.
 *
 * @param {Number} curso_id
 * @param {String} correo
 * @param {Boolean} error
 * @param {String} mensaje
 */
router.post('/user', async (req, res, next) => {
  // Usamos un try-catch para capturar posibles errores al momento de mandar las consultas
  try {
    const { curso_id, correo } = req.body;
    // TODO: Validaciones

    const userDB = await pool.query(
      'SELECT * FROM usuario WHERE usuario_correo = ?',
      [correo]
    );

    await pool.query(
      'INSERT INTO curso_usuario (curso_id,usuario_id,situacion_id) VALUES (?,?,?) ',
      [curso_id, userDB[0].usuario_id, 1]
    );

    res.status(201).json({ msg: 'Alumno añadido', err: false });
  } catch (err) {
    //Envio a middleware
    next(err);
  }
});

/**
 * Ruta para eliminar un usuario de un curso
 */
router.delete('/user', async (req, res, next) => {
  try {
    // TODO: Validaciones

    // Obtenemos los datos del cuerpo ed la peticion
    const { curso_id, usuario_id } = req.body;
    // Creamos el query para traeros la informacion de la bd
    await pool.query(
      'DELETE FROM curso_usuario WHERE curso_id = ? AND usuario_id = ?',
      [curso_id, usuario_id]
    );

    res.status(201).json({
      msg: 'Usuario eliminado del curso',
      err: false,
    });
  } catch (err) {
    //Envio a middleware
    next(err);
  }
});

/**
 * Metodo post para unirse a un curso mediante un codigo
 * Se especifica el codigo del curso a acceder
 * Declaramos la ruta
 * Se especifica el id del usuario que se unira al curso
 *
 * @param {String} codigo
 * @param {Number} usuario_id
 */
router.post('/code', async (req, res, next) => {
  // Usamos un try-catch para capturar posibles errores al momento de mandar las consultas
  try {
    const { curso_codigo, usuario_id } = req.body;
    // TODO: AGREGAR VALIDADIONES

    let mensaje = '';

    const response = await pool.query(
      'select * from curso_usuario where usuario_id = ? and curso_id = ((SELECT curso_id FROM curso WHERE curso_codigo = ?))',
      [usuario_id, curso_codigo]
    );

    if (response == '') {
      mensaje = 'Se agrego un nuevo usuario al curso';
      await pool.query(
        'INSERT INTO curso_usuario (curso_id, usuario_id, situacion_id) VALUES ((SELECT curso_id FROM curso WHERE curso_codigo = ?), ?, 1)',
        [curso_codigo, usuario_id]
      );
    } else {
      mensaje = 'El usuario ya se encuentra en el curso';
    }

    res.status(201).json({
      error: false,
      msg: mensaje,
    });
  } catch (err) {
    //Envio a middleware
    next(err);
  }
});

/**
 * Ruta para obtener la lista de cursos publicos
 */
router.get('/public', async (req, res, next) => {
  // Query para obtener la lista de cursos publicos
  const cursos = await pool.query('SELECT * FROM curso');
  //Obtenemos la cantidad de cursos
  let cantCursos = await pool.query(
    'SELECT count(curso_id) as total FROM curso'
  );
  // Respuesta a la peticion
  res.status(200).json({ cursos, total: cantCursos[0].total });
});

/**
 * Ruta para obtener la lista de cursos publicos
 */
router.get('/publicmax', async (req, res, next) => {
  // Query para obtener la lista de cursos publicos

  let cursos = await pool.query(
    'SELECT * FROM curso c GROUP BY c.curso_id ORDER BY COUNT(*) DESC LIMIT 4;'
  );
  // Respuesta a la peticion
  res.status(200).json(cursos);
});

/**
 * Ruta para obtener la lista de cursos publicos de un usuario
 */
router.get('/public/:iduser', async (req, res, next) => {
  // Obtenemos el id del usuario de los parametros de la ruta de la peticion
  const { iduser } = req.params;
  // Query para obtener la lista de cursos publicos de un usuario
  let cursos = await pool.query(
    'SELECT * FROM curso WHERE privacidad_id = 1 AND usuario_id = ?',
    [iduser]
  );
  // Respuesta a la peticion
  res.status(200).json(cursos);
});

/**
 * Ruta para actualizar los datos de un curso
 */
router.put('/:idcurso', async (req, res, next) => {
  //Empesamos con el try
  try {
    // Obtenemos el id del curso de los parametros de la ruta de la peticion
    const { idcurso } = req.params;
    // Obtenemos los datos del cuerpo de la peticion

    const {
      // curso_imagen,
      curso_nombre,
      curso_descripcion,
      curso_conoci_prev,
      privacidad_id,
      categoria_id,
    } = req.body;
    //Jsin para el nuevo curso
    const newCourse = {
      curso_nombre,
      curso_descripcion,
      curso_conoci_prev,
      privacidad_id,
      categoria_id,
      curso_fecha_modificacion: new Date(Date.now()),
    };
    // Aqui va el query para editar un curso
    await pool.query('UPDATE curso SET ? WHERE curso_id = ?', [
      newCourse,
      idcurso,
    ]);
    //variable para tener los cursos de la bd
    let course = await pool.query('SELECT * FROM curso WHERE curso_id = ?', [
      idcurso,
    ]);

    // Respuesta a la peticion
    res.status(201).json(course[0]);
  } catch (err) {
    //Envio a middleware
    next(err);
  }
});

/**
 * Unirse curso publico
 */
router.post('/join/:idcurso', async (req, res, next) => {
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
    let existe = '';
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
        res.status(200).json({ msg: 'Usuario unido al curso', err: false });
        //Else de la condicional
      } else {
        //Respiesta a la perticion
        res.status(200).json({ msg: 'Usuario ya existe', err: true });
      }
    } else {
      res.status(200).json({ msg: 'El curso no es publico', err: true });
    }
    //Manejo de errror
    //EMpezamos con el catch
  } catch (err) {
    //Envio a middleware
    next(err);
  }
});

/**
 * Esta es la ruta para obtener la informacion de un curso
 */
router.get('/:id', async (req, res, next) => {
  // Obtenemos el id del usuario de los parametros de la ruta de la peticion
  const { id } = req.params;

  // Aqui va el query para obtener un curso especifico por su id
  const course = await pool.query(
    'SELECT *, (SELECT COUNT(*) FROM curso_usuario WHERE curso_id = ? and situacion_id = 1) as alumnos  FROM curso WHERE curso_id = ?',
    [id, id]
  );

  // Respuesta a la peticion
  res.status(200).json(course[0]);
});

module.exports = router;
