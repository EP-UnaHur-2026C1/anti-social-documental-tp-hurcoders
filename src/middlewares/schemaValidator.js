//valida el body del request contra un schema Joi antes de que llegue al controlador

const schemaValidator = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.details.map((d) => d.message),
    });
  }
  next();
};

export default schemaValidator;
