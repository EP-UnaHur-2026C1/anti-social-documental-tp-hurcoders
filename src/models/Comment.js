import { Schema, model } from 'mongoose';

/**
 * Comment
 * Comentario que un usuario realiza sobre un Post. Incluye la fecha en
 * que fue realizado (`commentDate`) y un flag `isVisible` que indica si
 * corresponde mostrarlo según la ventana de visibilidad configurada
 * (COMMENT_VISIBILITY_MONTHS). Referencia a Post y User por _id.
 */
const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    commentDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    isVisible: {
      type: Boolean,
      required: true,
      default: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

commentSchema.index({ postId: 1, commentDate: 1 });

const Comment = model('Comment', commentSchema, 'comments');

export default Comment;
