const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'student'], required: true },
  rollNo: { type: String }, // Only for students
  course: { type: String }, // Only for students
  year: { type: String },   // Only for students
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 