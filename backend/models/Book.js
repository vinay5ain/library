const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  ISBN: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema); 