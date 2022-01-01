//Framework de nodejs
const express = require('express');
//Definicion del router
const router = express.Router();
//Definicion del pool sql
const pool = require('./../database');
//Nos trae el metodo para hacer querys a la BD

// Metodo GET para listar las sugerencias
router.get('/suggestions', async (req, res, next) => {
  // Se accede a la BD para listar todos los campos de las sugerencias
  let list = await pool.query('SELECT * FROM sugerencia');
  //Respuesta a la peticion
  res.status(200).json({
    // Se devuelve la lista de sugerencias al Forntend
    list,
  });
  //Manejo de errror
  //EMpezamos con el catch
});

// Metodo POST para guardar las sugerencias
router.post('/suggestions', async (req, res, next) => {
  try {
    // Parámetros necesarios para guardar las sugerencias
    const { categoria_id, sugerencia_nombre, sugerencia_descripcion } =
      req.body;
    // Se crea a la variable newSugesstion con los parámetros recogidos
    const newSugesstion = {
      categoria_id,
      sugerencia_nombre,
      sugerencia_descripcion,
    };
    // Se accede a la BD y se inserta o guarda newSuggestion en la BD
    await pool.query('INSERT INTO sugerencia SET ? ', [newSugesstion]);
    // Se selecciona la sugerencia previamente guardada a través del parámetro sugerencia_nombre_curso
    // const savedSugesstion = await pool.query('SELECT * FROM sugerencias WHERE curso_nombre = ?', [sugerencia_nombre_curso]);
    // Aca se debe de enviar la sugerenia creada
    // Se envia las sugerencia guardada al Frontend
    //Respuesta a la peticion
    res.status(201).json({
      msg: 'sugerencia guardada',
    });
    //Manejo de errror
    //EMpezamos con el catch
  } catch (err) {
    //Envio a middleware
    next(err);
  }
});
//Definicion de la ruta
router.get('/suggestions/:idsuggestions', async (req, res, next) => {
  // Obtenemos el id de la sugerencia de los parametros de la ruta de la peticion
  const { idsuggestions } = req.params;

  // Se accede a la BD para listar una sola sugerencia
  let list = await pool.query(
    'SELECT * FROM sugerencia WHERE sugerencia_id = ?',
    [idsuggestions]
  );
  //Respuesta a la peticion
  res.status(200).json({
    // Se devuelve la lista de sugerencias al Forntend
    list,
  });
  //Manejo de errror
  //EMpezamos con el catch
});

router.put('/votarSugerencias', async (req, res, next) => {
  // Metodo para votar sugerencias

  //Variables que sus datos son ingresados por el body
  const { usuario_id, sugerencia_id } = req.body;

  //Se crea una nueva variable para guardar los datos de usuario y sugerencia
  let votos_nuevo = {
    usuario_id,
    sugerencia_id,
  };
  //Si es correcto
  try {
    // Se accede a la BD para listar todos los votos de un usario
    let votos_usuario = await pool.query(
      'SELECT * FROM voto WHERE usuario_id = ?',
      [usuario_id]
    );

    //Lo que han ingresado
    //console.log(votos_nuevo)

    //Busca por sugerencia_id en el votos_usuario
    const resultado = votos_usuario.find(
      sugerencia => sugerencia.sugerencia_id == sugerencia_id
    );

    //Si no se encuentra en la tabla
    if (typeof resultado == 'undefined') {
      //Se inserta
      await pool.query('INSERT INTO votos SET ? ', votos_nuevo);

      // Respuesta a la peticion, se manda un mensaje
      //Respuesta a la peticion
      res.status(200).json({
        msg: 'Voto Registrado',
      });
    }
    //Si se encuentra en la tabla
    else {
      //Se Elimina
      await pool.query(
        ' DELETE FROM votos WHERE usuario_id = ? AND sugerencia_id = ? ',
        [usuario_id, sugerencia_id]
      );

      //Respuesta a la peticion
      res.status(200).json({
        msg: 'Voto Eliminado',
      });
    }

    //Manejo de errror
    //EMpezamos con el catch
  } catch (err) {
    //Envio a middleware
    next(err);
  }
});

router.get('/listarVotosUsuario/:idUsuario', async (req, res, next) => {
  //metodo para listar los votos por usuario.

  //Se ingresa el dato de codigo de usuario por el body
  const { idUsuario } = req.params;

  //cuando es correcto
  let list = await pool.query('SELECT * FROM voto WHERE usuario_id = ?', [
    idUsuario,
  ]);

  // Respuesta a la peticion, se manda un mensaje
  res.status(200).json({
    // Se devuelve la lista de votos de un usuario al Frontend
    list,
  });

  //Manejo de errror
  //EMpezamos con el catch
});

router.get('/listarSugerenciasVotos', async (req, res, next) => {
  // Metodo para listar el numero de votos de TODAS las sugerencias

  //cuando es correcto
  // Se accede a la BD para listar la sugerencias con su cantidad de votos
  let list = await pool.query(
    'SELECT sugerencia_id, COUNT(sugerencia_id) FROM voto GROUP BY sugerencia_id '
  );

  // Respuesta a la peticion, se manda un mensaje
  res.status(200).json({
    // Se devuelve la lista de sugerencias con su cantidad de votos al Frontend
    list,
  });

  //Manejo de errror
  //EMpezamos con el catch
});

router.get('/listarSugerenciasMasVotos', async (req, res, next) => {
  // Metodo para listar el numero votos de 3 sugerencias mas votadas
  // Se accede a la BD para listar la sugerencias con su cantidad de votos
  let list = await pool.query(
    'SELECT sugerencia_id, COUNT(sugerencia_id) FROM voto GROUP BY sugerencia_id ORDER BY COUNT(sugerencia_id) DESC LIMIT 3'
  );

  // Respuesta a la peticion, se manda un mensaje
  res.status(200).json({
    // Se devuelve la lista de sugerencias con su cantidad de "3" votos al Frontend
    list,
  });

  //Manejo de errror
  //EMpezamos con el catch
});

// Se exporta el modulo para poder ser usado
module.exports = router;
