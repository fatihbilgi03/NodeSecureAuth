// models/UnusedItem.js
const mongoose = require('mongoose');
const { Schema } = mongoose;
const unusedItemSchema = new Schema({
name: { type: String, required: true },
description: { type: String }
// Dikkat: userId alanı yok, çünkü bu item herhangi bir kullanıcıya aitdeğil
}, { timestamps: true });
module.exports = mongoose.model('UnusedItem', unusedItemSchema);