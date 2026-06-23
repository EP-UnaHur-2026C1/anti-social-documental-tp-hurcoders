import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/users.controller.js';
import schemaValidator from '../middlewares/schemaValidator.js';
import validaExisteMiddleware from '../middlewares/existeMiddleware.js';
import validateObjectId from '../middlewares/validateObjectId.js';
import { userSchema } from '../schemas/schemas.js';
import { User } from '../models/index.js';

const router = Router();

router.get('/', getUsers);
router.get('/:id', validateObjectId(), validaExisteMiddleware(User), getUserById);
router.post('/', schemaValidator(userSchema.create), createUser);
router.put('/:id', validateObjectId(), validaExisteMiddleware(User), schemaValidator(userSchema.update), updateUser);
router.delete('/:id', validateObjectId(), validaExisteMiddleware(User), deleteUser);

export default router;
