//Exportacion del modulo
module.exports = (req, res) => {
  //respuesta a la peticvion
  res.status(404).json({
    //Definicion del error
    error: 'not found',
    //Definicion del path
    path: req.path,
  });
};
