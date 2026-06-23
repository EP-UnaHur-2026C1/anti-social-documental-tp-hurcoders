import mongoose from 'mongoose';

// Valida que un parametro de ruta sea un ObjectId valido de Mongo.
// Puede usarse como middleware directo (valida :id) o como factory:
// validateObjectId('postId').
const validateObjectId = (paramOrReq = 'id', res, next) => {
  if (typeof paramOrReq === 'string') {
    return (req, response, nextMiddleware) => {
      const id = req.params[paramOrReq];
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(400).json({ message: 'El ID proporcionado no es valido' });
      }
      nextMiddleware();
    };
  }

  const req = paramOrReq;
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'El ID proporcionado no es valido' });
  }
  next();
};

export default validateObjectId;
