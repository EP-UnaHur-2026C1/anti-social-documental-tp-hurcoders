const { Router } = require('express');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/users.controller');
const validateObjectId = require('../middlewares/validateObjectId');

const router = Router();

router.get('/', getUsers);
router.get('/:id', validateObjectId, getUserById);
router.post('/', createUser);
router.put('/:id', validateObjectId, updateUser);
router.delete('/:id', validateObjectId, deleteUser);

module.exports = router;
