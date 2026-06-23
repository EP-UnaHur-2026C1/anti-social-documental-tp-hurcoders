import Joi from 'joi';

const objectId = Joi.string().hex().length(24);

const userSchema = {
  create: Joi.object({
    nickName: Joi.string().min(3).max(30).required(),
  }),
  update: Joi.object({
    nickName: Joi.string().min(3).max(30).optional(),
  }).min(1),
};

const postSchema = {
  create: Joi.object({
    title: Joi.string().min(1).required(),
    content: Joi.string().min(1).required(),
    userId: objectId.required(),
  }),
  update: Joi.object({
    content: Joi.string().min(1).required(),
  }).min(1),
};

const commentSchema = {
  create: Joi.object({
    content: Joi.string().min(1).required(),
    userId: objectId.required(),
  }),
  update: Joi.object({
    content: Joi.string().min(1).optional(),
  }).min(1),
};

const tagSchema = {
  create: Joi.object({
    name: Joi.string().min(1).max(50).required(),
  }),
  update: Joi.object({
    name: Joi.string().min(1).max(50).required(),
  }),
};

const postImageSchema = {
  create: Joi.object({
    imageUrl: Joi.string().uri().required(),
  }),
};

export { objectId, userSchema, postSchema, commentSchema, tagSchema, postImageSchema };
