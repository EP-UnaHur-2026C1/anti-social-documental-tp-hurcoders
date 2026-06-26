import { Post, User, Comment, Tag, PostTag } from '../models/index.js';
import responderErrorMongo from '../utils/responderErrorMongo.js';
import cacheKeys from '../utils/cacheKeys.js';
import { getCache, setCache } from '../utils/cache.js';
import invalidatePostCache from '../utils/postCache.js';

const visibilityMonths = parseInt(process.env.COMMENT_VISIBILITY_MONTHS || '6', 10);

const getVisibilityCutoff = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - visibilityMonths);
  return date;
};

const buildPosts = async (posts) =>{
  const postIds = posts.map((p) => p._id);
  const userIds = posts.map((p) => p.userId);
  const cutoff = getVisibilityCutoff();

  //Consultas en paralelo a la BD
  const [users, postTags, comments] = await Promise.all([
    //$in es un operador de consulta de MongoDB. Es el equivalente al IN de SQL
    User.find({ _id: { $in: userIds } }),
    PostTag.find({ postId: { $in: postIds } }).populate('tagId'),
    Comment.find({ postId: { $in: postIds }, commentDate: { $gte: cutoff } })
      .populate('userId', 'nickName')
      .sort({ commentDate: 1 }),
  ]);
  //Emsamblaje de los datos
    return posts.map((post) => ({
    ...post.toObject(),
    userId: users.find((u) => u._id.equals(post.userId)) || null,
    tags: postTags.filter((pt) => pt.postId.equals(post._id)).map((pt) => pt.tagId),
    comments: comments.filter((c) => c.postId.equals(post._id)),
  }));
};

const getPosts = async (req, res) => {
  try {
    const cached = await getCache(cacheKeys.postsList);
    if (cached) {
      return res.json(cached);
    }

    const posts = await Post.find()
      .populate('userId', 'nickName')
      .sort({ postDate: -1 });

    const postIds = posts.map((p) => p._id);

    const [comments, postTags] = await Promise.all([
      Comment.find({ postId: { $in: postIds } })
        .populate('userId', 'nickName')
        .sort({ commentDate: 1 }),
      PostTag.find({ postId: { $in: postIds } })
        .populate('tagId'),
    ]);

    const result = posts.map((post) => ({
      ...post.toObject(),
      comments: comments.filter((c) => c.postId.equals(post._id)),
      tags: postTags
        .filter((pt) => pt.postId.equals(post._id))
        .map((pt) => pt.tagId),
    }));

    await setCache(cacheKeys.postsList, result);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const cacheKey = cacheKeys.postById(req.params.id);
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const post = await Post.findById(req.params.id).populate('userId', 'nickName');
    if (!post) return res.status(404).json({ error: 'Post no encontrado' });

    const [comments, postTags] = await Promise.all([
      Comment.find({ postId: post._id })
        .populate('userId', 'nickName')
        .sort({ commentDate: 1 }),
      PostTag.find({ postId: post._id })
        .populate('tagId'),
    ]);

    const result = {
      ...post.toObject(),
      comments,
      tags: postTags.map((pt) => pt.tagId),
    };

    await setCache(cacheKey, result);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createPost = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const post = await Post.create(req.body);
    await invalidatePostCache();
    res.status(201).json(post);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!post) return res.status(404).json({ error: 'Post no encontrado' });
    await invalidatePostCache(req.params.id);
    res.json(post);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

const removePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post no encontrado' });
    await invalidatePostCache(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Images

const addImagePost = async (req, res) => {
  // El middleware validaExisteMiddleware ya garantizó que el post existe.
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $push: { images: { imageUrl: req.body.imageUrl } } },
    { new: true, runValidators: true }
  );
  await invalidatePostCache(req.params.id);
  res.status(201).json(post.images[post.images.length - 1]);
};

const uploadImagePost = async (req, res) => {
  // El middleware validaExisteMiddleware ya garantizó que el post existe.
  if (!req.file) return res.status(400).json({ error: 'No se ha subido ningún archivo' });

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $push: { images: { imageUrl } } },
    { new: true, runValidators: true }
  );
  await invalidatePostCache(req.params.id);
  res.status(201).json(post.images[post.images.length - 1]);
};

const removeImagePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  const image = post.images.id(req.params.imageId);
  if (!image) return res.status(404).json({ error: 'Imagen no encontrada' });
  image.deleteOne();
  await post.save();
  await invalidatePostCache(req.params.id);
  res.status(204).send();
};

// Tags

const addTagPost = async (req, res) => {
  // El middleware validaExisteMiddleware ya garantizó que el post existe.
  const tag = await Tag.findById(req.params.tagId);
  if (!tag) return res.status(404).json({ error: 'Tag no encontrado' });

  try {
    await PostTag.create({ postId: req.params.id, tagId: req.params.tagId });
    await invalidatePostCache(req.params.id);
    res.status(201).json({ message: 'Tag agregado al Post' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'El tag ya está asociado a este post' });
    }
    return responderErrorMongo(res, err);
  }
};

const removeTagPost = async (req, res) => {
  // El middleware validaExisteMiddleware ya garantizó que el post existe.
  const tag = await Tag.findById(req.params.tagId);
  if (!tag) return res.status(404).json({ error: 'Tag no encontrado' });

  await PostTag.findOneAndDelete({ postId: req.params.id, tagId: req.params.tagId });
  await invalidatePostCache(req.params.id);
  res.status(204).send();
};

export { getPosts, getPostById, createPost, updatePost, removePost, addImagePost, uploadImagePost, removeImagePost, addTagPost, removeTagPost };
