/**
 * Traduce errores típicos de Mongoose/MongoDB a respuestas HTTP
 */
function responderErrorMongo(res, error) {
  // Error de índice único
  if (error.code === 11000) {
    const campo = Object.keys(error.keyPattern || {})[0] || 'campo';
    return res.status(409).json({
      message: `Valor duplicado para el campo único '${campo}'.`,
      errores: [{ atributo: campo, error: 'Ya existe un documento con ese valor.' }],
    });
  }

  // Error de validación de schema de Mongoose
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Error de validación.',
      errores: Object.values(error.errors).map((e) => ({
        atributo: e.path,
        error: e.message,
      })),
    });
  }

  // ObjectId mal formado
  if (error.name === 'CastError') {
    return res.status(400).json({
      message: `El valor '${error.value}' no es un identificador válido para '${error.path}'.`,
    });
  }

  console.error(error);
  return res.status(500).json({ message: 'Error interno del servidor.' });
}

module.exports = responderErrorMongo;
