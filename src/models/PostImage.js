'use strict';
const { Schema, model } = require('mongoose');

/**
 * PostImage
 * Registra las imágenes asociadas a un Post. Para el MVP solo se
 * almacena la URL de la imagen alojada (subida a disco o externa).
 * Referencia al Post dueño vía `postId`, permitiendo agregar o
 * eliminar imágenes de forma independiente.
 */
const postImageSchema = new Schema(
  {
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

postImageSchema.index({ postId: 1 });

module.exports = model('PostImage', postImageSchema, 'post_images');
