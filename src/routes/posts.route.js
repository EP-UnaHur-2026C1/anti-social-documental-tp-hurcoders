import { Router } from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  removePost,
} from '../controllers/posts.controller.js';
import validateObjectId from '../middlewares/validateObjectId.js';

const router = Router();

router.get('/', getPosts);
router.get('/:id', validateObjectId, getPostById);
router.post('/', createPost);
router.put('/:id', validateObjectId, updatePost);
router.delete('/:id', validateObjectId, removePost);

export default router;
