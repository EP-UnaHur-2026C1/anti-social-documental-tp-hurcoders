const router = require('express').Router();
const ctrl = require('../controllers/users.controller');
const schemaValidator = require('../middlewares/schemaValidator.js');
const validaExisteMiddleware = require('../middlewares/existeMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');
const { userSchema } = require('../schemas/schemas');
const { User } = require('../models');

router.get('/', ctrl.getUsers);
router.get('/:id', validateObjectId(), validaExisteMiddleware(User), ctrl.getUserById);
router.post('/', schemaValidator(userSchema.create), ctrl.createUser);
router.put('/:id', validateObjectId, validaExisteMiddleware(User), validate(userSchema.update), ctrl.updateUser, ctrl.updateUser);
router.delete('/:id', validateObjectId, validaExisteMiddleware(User), ctrl.deleteUser);

module.exports = router;
