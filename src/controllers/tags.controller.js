const { Tag, PostTag, Post } = require('../models');
const responderErrorMongo = require('../utils/responderErrorMongo');

const getTags = async (req, res) => {
  const tags = await Tag.find().sort({ name: 1 });
  res.json(tags);
};

const getTagById = async (req, res) => {
  // El middleware validaExisteMiddleware ya garantizó que el tag existe.
  const tag = req.idDoc;

  const postTags = await PostTag.find({ tagId: tag._id });
  const postIds = postTags.map((pt) => pt.postId);
  const posts = await Post.find({ _id: { $in: postIds } });

  res.json({ ...tag.toObject(), posts });
};

const createTag = async (req, res) => {
  try {
    const tag = await Tag.create(req.body);
    res.status(201).json(tag);
  } catch (err) {
    return responderErrorMongo(res, err);
  }
};

const updateTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(tag);
  } catch (err) {
    return responderErrorMongo(res, err);
  }
};

const removeTag = async (req, res) => {
  await Tag.findByIdAndDelete(req.params.id);
  await PostTag.deleteMany({ tagId: req.params.id });
  res.status(204).send();
};

module.exports = { getTags, getTagById, createTag, updateTag, removeTag };
