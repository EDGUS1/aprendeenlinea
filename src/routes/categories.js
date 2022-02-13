//Framework de nodejs
const express = require('express');
//Definicion del router
const router = express.Router();
//Definicion del pool sql
const pool = require('./../database');
//Nos trae el metodo para hacer querys a la BD

/**
 * Ruta para listar las categorias
 */
router.get('/', async (req, res, next) => {
  // Aqui va el query para listar las categorias
  const categories = await pool.query('SELECT * FROM categoria');

  //Respuesta a la peticion
  res.status(200).json(categories);
});

/**
 * Ruta para listar las categorias
 */
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  // Aqui va el query para listar las categorias
  const categories = await pool.query(
    'SELECT * FROM categoria WHERE categoria_id = ?',
    [id]
  );

  //Respuesta a la peticion
  res.status(200).json(categories);
});
//exportacion del router
module.exports = router;
