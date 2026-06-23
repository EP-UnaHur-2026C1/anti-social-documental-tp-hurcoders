import mongoose from 'mongoose';
/**
 * PostTag
 * Colección intermedia que resuelve la relación muchos-a-muchos entre
 * Post y Tag (una etiqueta puede estar en muchos posts, un post puede
 * tener muchas etiquetas). Equivalente documental de la tabla pivote
 * `post_tags` del modelo relacional original. Cada documento referencia
 * a un Post y a un Tag por su _id.
 */
const postTagSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    tagId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag',
      required: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// Evita asociar el mismo tag dos veces al mismo post.
postTagSchema.index({ postId: 1, tagId: 1 }, { unique: true });

const PostTag = mongoose.model('PostTag', postTagSchema);

export default PostTag;
