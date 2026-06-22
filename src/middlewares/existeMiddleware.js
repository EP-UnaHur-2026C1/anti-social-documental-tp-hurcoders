const mongoose = require('mongoose');

/**
 * Valida que exista un documento con el _id recibido en el parámetro de
 * ruta indicado, para el Modelo Mongoose pasado por parámetro. Si existe,
 * lo deja disponible en req[nombreParametro + 'Doc'] para evitar volver a
 * buscarlo en el controlador (única responsabilidad: el middleware se
 * encarga de la verificación, el controlador de la lógica de negocio).
 *
 * @param {import('mongoose').Model} Modelo
 * @param {string} [nombreParametro='id'] clave en req.params
 */
const validaExisteMiddleware = (Modelo, nombreParametro = 'id') => {
  return async (req, res, next) => {
    const id = req.params[nombreParametro];
    const documento = await Modelo.findById(id);
    if (!documento) {
      return res.status(404).json({
        message: `El id ${id} en modelo ${Modelo.modelName} no existe`,
      });
    }
    req[`${nombreParametro}Doc`] = documento;
    next();
  };
};

module.exports = {
  validaExisteMiddleware,
};