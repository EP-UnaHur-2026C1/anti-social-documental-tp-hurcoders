import { Comment, User } from '../models/index.js';
import responderErrorMongo from '../utils/responderErrorMongo.js';
import invalidatePostCache from '../utils/postCache.js';

const visibilityMonths = parseInt(process.env.COMMENT_VISIBILITY_MONTHS || '6', 10);

const getVisibilityCutoff = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - visibilityMonths);
  return date;
};

const getCommentsByPost = async (req, res) => {
  // El middleware validaExisteMiddleware (sobre Post, parámetro postId)
  // ya garantizó que el post existe.
  const cutoff = getVisibilityCutoff();

  const comments = await Comment.find({ postId: req.params.postId })
    .populate('userId', 'nickName')
    .sort({ commentDate: 1 });

  const result = comments.map((c) => {
    const obj = c.toObject();
    obj.isVisible = obj.commentDate >= cutoff;
    return obj;
  });

  res.json(result);
};

const createComment = async (req, res) => {
  // El middleware validaExisteMiddleware (sobre Post, parámetro postId)
  // ya garantizó que el post existe.
  const user = await User.findById(req.body.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  try {
    const comment = await Comment.create({
      content: req.body.content,
      userId: req.body.userId,
      postId: req.params.postId,
      isVisible: true,
    });
    await invalidatePostCache(req.params.postId);
    res.status(201).json(comment);
  } catch (err) {
    return responderErrorMongo(res, err);
  }
};

const updateComment = async (req, res) => {
  const comment = await Comment.findOneAndUpdate(
    { _id: req.params.id, postId: req.params.postId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!comment) return res.status(404).json({ error: 'Comment not found' });
  await invalidatePostCache(req.params.postId);
  res.json(comment);
};

const deleteComment = async (req, res) => {
  const comment = await Comment.findOneAndDelete({
    _id: req.params.id,
    postId: req.params.postId,
  });
  if (!comment) return res.status(404).json({ error: 'Comment not found' });
  await invalidatePostCache(req.params.postId);
  res.status(204).send();
};

export { getCommentsByPost, createComment, updateComment, deleteComment };
