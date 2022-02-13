const express = require('express');
//Definicion del router
const router = express.Router();
//Definicion del pool sql
const pool = require('./../database');

/**
 * Guardar archivo en material
 */
router.post('/file', async (req, res, next) => {
  const { origen_id, tipo_id, archivo_url, archivo_nombre } = req.body;

  const list = await pool.query(
    'insert into archivo (origen_id, tipo_id, archivo_url, archivo_nombre) values (?,?,?,?) ',
    [origen_id, tipo_id, archivo_url, archivo_nombre]
  );
  // Respuesta a la peticion
  res.status(200).json({
    list,
  });
});

/**
 * Listar materiales de un curso
 */
router.get('/:idcurso', async (req, res, next) => {
  // Obtenemos los datos de los parametros
  const { idcurso } = req.params;

  const listaMaterial = await pool.query(
    'SELECT * from material WHERE curso_id = ?',
    [idcurso]
  );

  res.status(200).json(listaMaterial);
});

/**
 * Listar archivos de un material
 */
router.get('/:id/:tipo', async (req, res, next) => {
  const { id, tipo } = req.params;

  const archivos = await pool.query(
    'select * from archivo where origen_id = ? and tipo_id = ?',
    [id, tipo]
  );

  res.status(200).json(archivos);
});

/**
 * Ruta para crear un nuevo material de un curso
 */
router.post('/course/:idcurso', async (req, res, next) => {
  //Empesamos con el try
  try {
    // Obtenemos el id del curso de los parametros de la ruta de la peticion
    const { idcurso } = req.params;

    // Obtenemos los datos del cuerpo de la peticion

    const { material_nombre, material_descripcion } = req.body;
    //Creamos un json para el nuevo material
    const newMaterial = {
      material_nombre,
      material_descripcion,
      curso_id: idcurso,
    };
    // Aqui va el query para guardar un nuevo material de un curso
    const list = await pool.query('INSERT INTO material SET ? ', newMaterial);

    // Respuesta a la peticion
    res.status(201).json(list);
    //Manejo de errror
    //EMpezamos con el catch
  } catch (err) {
    //Envio a middleware
    next(err);
  }
});

module.exports = router;
