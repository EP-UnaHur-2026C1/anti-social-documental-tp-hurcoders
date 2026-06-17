const { Router } = require('express');
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  removePost,
} = require('../controllers/posts.controller');
const validateObjectId = require('../middlewares/validateObjectId');

const router = Router();

router.get('/', getPosts);
router.get('/:id', validateObjectId, getPostById);
router.post('/', createPost);
router.put('/:id', validateObjectId, updatePost);
router.delete('/:id', validateObjectId, removePost);

module.exports = router;
