'use strict';
const router = require('express').Router();
const postCtrl = require('../controllers/posts.controller');
const commentCtrl = require('../controllers/comments.controller');
const schemaValidator = require('../middlewares/schemaValidator');
const { postSchema, commentSchema, postImageSchema } = require('../schemas/schemas');
const { Post } = require('../models');
const validaExisteMiddleware = require('../middlewares/existeMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');

const existePost = [validateObjectId(), validaExisteMiddleware(Post)];
const existePostComoPostId = [
  validateObjectId('postId'),
  validaExisteMiddleware(Post, 'postId'),
];

//CRUD Posts
router.get('/', postCtrl.getPosts);
router.get('/:id', ...existePost, postCtrl.getPostById);
router.post('/', schemaValidator(postSchema.create), postCtrl.createPost);
router.put('/:id', ...existePost, schemaValidator(postSchema.update), postCtrl.updatePost);
router.delete('/:id', ...existePost, postCtrl.removePost);

// Tags
router.post('/:id/tags/:tagId', ...existePost, postCtrl.addTag);
router.delete('/:id/tags/:tagId', ...existePost, postCtrl.removeTag);

// Comments
router.get('/:postId/comments', ...existePostComoPostId, commentCtrl.getCommentsByPost);
router.post(
  '/:postId/comments',
  ...existePostComoPostId,
  schemaValidator(commentSchema.create),
  commentCtrl.createComment
);
router.put('/:postId/comments/:id', ...existePostComoPostId, schemaValidator(commentSchema.update), commentCtrl.updateComment);
router.delete('/:postId/comments/:id', ...existePostComoPostId, commentCtrl.deleteComment);

export default router;
