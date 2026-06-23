import { Router } from 'express';
import {
  getTags,
  getTagById,
  createTag,
  updateTag,
  removeTag,
} from '../controllers/tags.controller.js';
import schemaValidator from '../middlewares/schemaValidator.js';
import { tagSchema } from '../schemas/schemas.js';
import { Tag } from '../models/index.js';
import validaExisteMiddleware from '../middlewares/existeMiddleware.js';
import validateObjectId from '../middlewares/validateObjectId.js';

const router = Router();

router.get('/', getTags);
router.get('/:id', validateObjectId(), validaExisteMiddleware(Tag), getTagById);
router.post('/', schemaValidator(tagSchema.create), createTag);
router.put(
  '/:id',
  validateObjectId(),
  validaExisteMiddleware(Tag),
  schemaValidator(tagSchema.update),
  updateTag
);
router.delete('/:id', validateObjectId(), validaExisteMiddleware(Tag), removeTag);

export default router;
