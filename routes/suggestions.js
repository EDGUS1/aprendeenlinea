// Middlewares
const express = require('express')
const router = express.Router()

const pool = require('../src/database')

// Metodo GET para listar las sugerencias
router.get('/suggestions', async (req, res, next) => {
  try {
    // Se accede a la BD para listar todos los campos de las sugerencias
    let list = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.sugerencias')
    res.status(200).json({
      // Se devuelve la lista de sugerencias al Forntend
      list
    })
  } catch (err) {
    // Se maneja el error en caso de haberlo
    next(err)
  }
})

// Metodo POST para guardar las sugerencias
router.post('/suggestions', async (req, res, next) => {
  try {
    // Parámetros necesarios para guardar las sugerencias
    const { categoria_id, sugerencia_nombre_curso, sugerencia_puntuacion_curso, numero_votos, sugerencia_estado, descripcion } = req.body
    // Se crea a la variable newSugesstion con los parámetros recogidos
    const newSugesstion = {
      categoria_id,
      sugerencia_nombre_curso,
      sugerencia_puntuacion_curso,
      numero_votos,
      sugerencia_estado,
      descripcion
    }
    console.log(newSugesstion)
    // Se accede a la BD y se inserta o guarda newSuggestion en la BD
    await pool.query('INSERT INTO heroku_b3e0382f6ba83ba.sugerencias SET ? ', [newSugesstion])
    // Se selecciona la sugerencia previamente guardada a través del parámetro sugerencia_nombre_curso
    // const savedSugesstion = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.sugerencias WHERE curso_nombre = ?', [sugerencia_nombre_curso]);
    // Aca se debe de enviar la sugerenia creada
    // Se envia las sugerencia guardada al Frontend
    res.status(201).json({
      msg: 'sugerencia guardada'
    })
  } catch (e) {
    // Se maneja el error en caso de haberlo
    console.log(e)
    next(e)
  }
})

router.get('/suggestions/:idsuggestions', async (req, res, next) => {
  try {
    // Obtenemos el id de la sugerencia de los parametros de la ruta de la peticion
    const { idsuggestions } = req.params

    // Se accede a la BD para listar una sola sugerencia
    let list = await pool.query('SELECT * FROM heroku_b3e0382f6ba83ba.sugerencias WHERE sugerencia_id = ?', [idsuggestions])
    res.status(200).json({
      // Se devuelve la lista de sugerencias al Forntend
      list
    })
  } catch (err) {
    // Se maneja el error en caso de haberlo
    next(err)
  }
})


router.post('/votarSugerencias', async (req, res, next) => {
  // Metodo para votar sugerencias

  //Variables que sus datos son ingresados por el body
  const { usuario_id, sugerencia_id } = req.body

  //Se crea un obtejo con las variables de usuario_id, sugerencias_id
  let VotarPorSugerencia = {
    usuario_id,
    sugerencia_id
  }

  //Si es correcto 
  try {

    //Se insetar en la tabla de votos, el objeto de votar
    await pool.query('INSERT INTO heroku_b3e0382f6ba83ba.votos SET ? ', VotarPorSugerencia)

    // Respuesta a la peticion, se manda un mensaje 
    res.status(200).json({
      msg: 'Voto Registrado'
    })
  }  catch (e) { //Si hay algun error
    next(e)
  }
})

router.get('/listarSugerenciasVotos', async(req,res,next)=>{
  // Metodo para listar el numero de votos de TODAS las sugerencias
  try{
    // Se accede a la BD para listar la sugerencias con su cantidad de votos
    let list = await pool.query('SELECT sugerencia_id, COUNT(sugerencia_id) FROM votos GROUP BY sugerencia_id ')
    
    // Respuesta a la peticion, se manda un mensaje 
    res.status(200).json({
      // Se devuelve la lista de sugerencias con su cantidad de votos al Frontend
      list
    })

  }catch(e){ //Si hay algun error
    next(e)
  }
})

router.get('/listarSugerenciasMasVotos', async(req,res,next)=>{
  // Metodo para listar el numero votos de 3 sugerencias mas votadas
  try{
    // Se accede a la BD para listar la sugerencias con su cantidad de votos
    let list = await pool.query('SELECT sugerencia_id, COUNT(sugerencia_id) FROM votos GROUP BY sugerencia_id ORDER BY COUNT(sugerencia_id) DESC LIMIT 3')
    
    // Respuesta a la peticion, se manda un mensaje 
    res.status(200).json({
    // Se devuelve la lista de sugerencias con su cantidad de "3" votos al Frontend
      list
    })

  }catch(e){ //Si hay algun error
    next(e)
  }
})



// Se exporta el modulo para poder ser usado
module.exports = router
