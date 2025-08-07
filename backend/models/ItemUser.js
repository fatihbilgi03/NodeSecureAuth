// models/ItemUser.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ItemUserSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemId: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  createdBy: {             // atamayı yapan admin ID’si
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ItemUser', ItemUserSchema);
