import { Router } from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  removePost,
  addImagePost,
  removeImagePost,
  addTagPost,
  removeTagPost,
} from '../controllers/posts.controller.js';
import {
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
} from '../controllers/comments.controller.js';
import schemaValidator from '../middlewares/schemaValidator.js';
import { postSchema, commentSchema, postImageSchema } from '../schemas/schemas.js';
import { Post } from '../models/index.js';
import validaExisteMiddleware from '../middlewares/existeMiddleware.js';
import validateObjectId from '../middlewares/validateObjectId.js';

const router = Router();

const existePost = [validateObjectId(), validaExisteMiddleware(Post)];
const existePostComoPostId = [
  validateObjectId('postId'),
  validaExisteMiddleware(Post, 'postId'),
];

//CRUD Posts
router.get('/', getPosts);
router.get('/:id', ...existePost, getPostById);
router.post('/', schemaValidator(postSchema.create), createPost);
router.put('/:id', ...existePost, schemaValidator(postSchema.update), updatePost);
router.delete('/:id', ...existePost, removePost);

// Images embebidas en Post
router.post('/:id/images', ...existePost, schemaValidator(postImageSchema.create), addImagePost);
router.delete('/:id/images/:imageId', ...existePost, validateObjectId('imageId'), removeImagePost);

// Tags
router.post('/:id/tags/:tagId', ...existePost, validateObjectId('tagId'), addTagPost);
router.delete('/:id/tags/:tagId', ...existePost, validateObjectId('tagId'), removeTagPost);

// Comments
router.get('/:postId/comments', ...existePostComoPostId, getCommentsByPost);
router.post(
  '/:postId/comments',
  ...existePostComoPostId,
  schemaValidator(commentSchema.create),
  createComment
);
router.put(
  '/:postId/comments/:id',
  ...existePostComoPostId,
  validateObjectId(),
  schemaValidator(commentSchema.update),
  updateComment
);
router.delete('/:postId/comments/:id', ...existePostComoPostId, validateObjectId(), deleteComment);

export default router;
