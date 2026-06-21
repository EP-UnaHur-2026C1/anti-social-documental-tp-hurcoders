import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/users.controller.js';
import validateObjectId from '../middlewares/validateObjectId.js';

const router = Router();

router.get('/', getUsers);
router.get('/:id', validateObjectId, getUserById);
router.post('/', createUser);
router.put('/:id', validateObjectId, updateUser);
router.delete('/:id', validateObjectId, deleteUser);

export default router;
