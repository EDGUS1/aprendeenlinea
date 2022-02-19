const express = require('express');
const router = express.Router();
const pool = require('./../database');

/**
 * Metodo get para listar los cursos con solicitud de acceso que tiene un profesor
 * Declaramos la ruta
 * Se especifica el id del usuario profesor quien creo los cursos con solcicitud de acceso
 * @param {Number} usuario_id
 */
router.get('/solicitud/:usuario_id', async (req, res, next) => {
  const { usuario_id } = req.params;
  // Hacemos la consulta a base de datos mediante el pool pasando como parametros el objeto creado lineas arriba
  // Guardamos el resultado de otra consulta para mostrarlo como mensaje de salida
  const listaSolicitudes = await pool.query(
    "SELECT curso_usuario.*, curso.curso_nombre, CONCAT(usuario.usuario_nombre, ' ', usuario.usuario_apellido_paterno) as usuario_nombre FROM curso INNER JOIN curso_usuario ON curso_usuario.curso_id = curso.curso_id INNER JOIN usuario on usuario.usuario_id = curso_usuario.usuario_id WHERE curso.usuario_id = ? AND curso_usuario.situacion_id = 3 UNION SELECT curso_usuario.*, curso.curso_nombre, CONCAT(usuario.usuario_nombre, ' ', usuario.usuario_apellido_paterno) as usuario_nombre FROM usuario INNER JOIN curso_usuario ON curso_usuario.usuario_id = usuario.usuario_id INNER JOIN curso on curso.curso_id = curso_usuario.curso_id WHERE curso_usuario.usuario_id = ? AND curso_usuario.situacion_id = 4",
    [usuario_id, usuario_id]
  );
  // AND curso_usuario.usuario_id != ?
  // Se muestra la respuesta exitosa a la consulta
  res.status(200).json(listaSolicitudes);
});

/**
 * Metodo post para aceptar la invitacion para acceder a un curso
 * Se especifica el id del usuario a quien se le manda la invitacion
 * Se especifica el id del curso al que invita al usuario
 * Declaramos la ruta
 *
 * @param {Number} usuario_id
 * @param {Number} curso_id
 */
router.put('/aceptar', async (req, res, next) => {
  // Especificamos que la consulta se hara con un body.
  const { usuario_id, curso_id } = req.body;

  // Guardamos el resultado de otra consulta para mostrarlo como mensaje de salida
  const response = await pool.query(
    'UPDATE curso_usuario SET situacion_id = 1 where curso_id = ? and usuario_id = ?',
    [curso_id, usuario_id]
  );
  // Se muestra la respuesta exitosa a la consulta
  res.status(201).json(response);
});

/**
 * Metodo post para negar la invitacion para acceder a un curso
 * Se especifica el id del usuario a quien se le manda la invitacion
 * Se especifica el id del curso al que invita al usuario
 * Declaramos la ruta
 *
 * @param {Number} usuario_id
 * @param {Number} curso_id
 */
router.put('/denegar', async (req, res, next) => {
  // Especificamos que la consulta se hara con un body.
  const { usuario_id, curso_id } = req.body;

  // Guardamos el resultado de otra consulta para mostrarlo como mensaje de salida
  const response = await pool.query(
    'UPDATE curso_usuario SET situacion_id = 2 where curso_id = ? and usuario_id = ?',
    [curso_id, usuario_id]
  );
  // Se muestra la respuesta exitosa a la consulta
  res.status(201).json(response);
});

/**
 * Aqui el query para solicitar acceso a un curso privado
 * Metodo para que el alumno pueda solicitad un notificacion al profesor que quiere unirse a su curso privado
 */
router.post('/solicitar', async (req, res, next) => {
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

    //Se manda en forma de json al fronted los datos encontrados en la tabla
    res.status(201).json({ msg: 'Se registro con éxito', err: false });

    //Manejo de errror
    //EMpezamos con el catch
  } catch (err) {
    //Envio a middleware
    next(err);
  }
});

module.exports = router;
