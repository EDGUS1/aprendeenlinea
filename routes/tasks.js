const express = require('express')
const router = express.Router()
const pool = require('../src/database');

router.post('/crearTarea', async (req, res, next) => {
  //Esta es la ruta para crear una nueva tarea

  //Obtenemos los datos de la nueva tarea del cuerpo de la peticion
  const {curso_id, nombre, descripcion, tarea_fecha_creacion, tarea_fecha_entrega} = req.body;

  const newTarea = {
    curso_id,
    nombre,
    descripcion,
    tarea_fecha_creacion,
    tarea_fecha_entrega
  }

  try{
    //Aqui va el query para crear una nueva tarea
    await pool.query('INSERT INTO heroku_b3e0382f6ba83ba.tareas  set ? ', newTarea);
    
    //Respuesta a la peticion
    res.status(200).json({
      msg: 'tarea creada'
    })

  }catch(err){
    next(err);
  }

})

module.exports = router