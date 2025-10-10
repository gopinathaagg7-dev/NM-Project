const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  sales: Number,
  views: Number,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
