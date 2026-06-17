const mongoose = require('mongoose');

// Usuario registrado. nickName es unico y funciona como identificador de negocio.
const userSchema = new mongoose.Schema(
  {
    nickName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
