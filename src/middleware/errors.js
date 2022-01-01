//Manejo de Errores
const ERROR_HANDLERS = {
  //Error validate
  //Error Json
  //Error tipical
  Error: res =>
    res.status(400).json({
      //Mensahe de error
      error: 'data invalid',
    }),
  //Definicion del default error
  defaultError: res => res.status(500).end(),
};
//exportacion del modulo
module.exports = (error, req, res, next) => {
  //Definicion del handler
  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError;
  //Instancia del handler
  handler(res, error);
};
