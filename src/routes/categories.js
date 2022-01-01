//Framework de nodejs
const express = require('express');
//Definicion del router
const router = express.Router();
//Definicion del pool sql
const pool = require('./../database');
//Nos trae el metodo para hacer querys a la BD

//Definicion de la ruta
router.get('/categories', async (req, res, next) => {
  // Ruta para listar las categorias
  // Aqui va el query para listar las categorias
  const categories = await pool.query('SELECT * FROM categoria');

  //Respuesta a la peticion
  res.status(200).json({
    categories,
  });
});

router.get('/categories/:cat_id', async (req, res, next) => {
  // Ruta para listar las categorias

  const { cat_id } = req.params;
  // Aqui va el query para listar las categorias
  const categories = await pool.query(
    'SELECT * FROM categoria WHERE categoria_id = ?',
    [cat_id]
  );

  //Respuesta a la peticion
  res.status(200).json({
    categories,
  });
});
//exportacion del router
module.exports = router;
