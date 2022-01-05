const express = require('express');
//Definicion del router
const router = express.Router();
//Definicion del pool sql
const pool = require('./../database');

router.post('/materialfile', async (req, res, next) => {
  const { origen_id, tipo_id, archivo_url, archivo_nombre } = req.body;

  const list = await pool.query(
    'insert into archivo (origen_id, tipo_id, archivo_url, archivo_nombre) values (?,?,?,?) ',
    [origen_id, tipo_id, archivo_url, archivo_nombre]
  );
  // Respuesta a la peticion
  res.status(200).json({
    list,
  });
  //Manejo de errror
  //EMpezamos con el catch
});

router.get('/listMaterials/:idcurso', async (req, res, next) => {
  // Obtenemos los datos de los parametros
  const { idcurso } = req.params;

  const listaMaterial = await pool.query(
    'SELECT * from material WHERE curso_id = ?',
    [idcurso]
  );

  // const archivos = await pool.query(
  //   'select * from archivo where origen_id = ? and tipo_id = 2',
  //   [listaMaterial[0].material_id]
  // );

  // console.log(listaMaterial);

  res.status(200).json(listaMaterial);
});

router.get('/listMaterialsFiles/:id/:tipo', async (req, res, next) => {
  const { id, tipo } = req.params;

  const archivos = await pool.query(
    'select * from archivo where origen_id = ? and tipo_id = ?',
    [id, tipo]
  );
  // console.log(archivos);

  res.status(200).json(archivos);
});

module.exports = router;
