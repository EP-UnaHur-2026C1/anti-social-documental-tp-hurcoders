'use strict';
const router = require('express').Router();
const ctrl = require('../controllers/tags.controller');
const schemaValidator = require('../middlewares/schemaValidator');
const { tagSchema } = require('../schemas/schemas');
const { Tag } = require('../models');
const validaExisteMiddleware = require('../middlewares/existeMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');

router.get('/', ctrl.getTags);
router.get('/:id', validateObjectId(), validaExisteMiddleware(Tag), ctrl.getTagById);
router.post('/', schemaValidator(tagSchema.create), ctrl.createTag);
router.put(
  '/:id',
  validateObjectId(),
  validaExisteMiddleware(Tag),
  schemaValidator(tagSchema.update),
  ctrl.updateTag
);
router.delete('/:id', validateObjectId(), validaExisteMiddleware(Tag), ctrl.removeTag);

module.exports = router;
