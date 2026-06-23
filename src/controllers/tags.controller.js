import { Tag, PostTag, Post } from '../models/index.js';
import responderErrorMongo from '../utils/responderErrorMongo.js';
import invalidatePostCache from '../utils/postCache.js';

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
    await invalidatePostCache();
    res.json(tag);
  } catch (err) {
    return responderErrorMongo(res, err);
  }
};

const removeTag = async (req, res) => {
  await Tag.findByIdAndDelete(req.params.id);
  await PostTag.deleteMany({ tagId: req.params.id });
  await invalidatePostCache();
  res.status(204).send();
};

export { getTags, getTagById, createTag, updateTag, removeTag };
