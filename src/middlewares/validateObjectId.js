import mongoose from 'mongoose';

// Valida que el parametro :id sea un ObjectId valido de Mongo.
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'El ID proporcionado no es valido' });
  }
  next();
};

export default validateObjectId;
