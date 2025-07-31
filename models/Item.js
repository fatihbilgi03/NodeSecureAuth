// models/Item.js
const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const itemSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  userId: { type: Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
