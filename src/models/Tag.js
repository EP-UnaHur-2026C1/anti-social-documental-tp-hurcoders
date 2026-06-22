const { Schema, model } = require('mongoose');

/**
 * Tag
 * Etiqueta que puede asignarse a uno o más posts. El propio documento
 * Tag no conoce a sus posts: la relación muchos-a-muchos se resuelve
 * con la colección intermedia PostTag (ver postTag.model.js), igual
 * patrón de referencia por _id que el resto del modelo.
 */
const tagSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

module.exports = model('Tag', tagSchema, 'tags');
