// models/User.js
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email:    { 
    type: String, required: true, unique: true, trim: true,
    lowercase: true, match: [/.+@.+\..+/, 'Lütfen geçerli bir e-posta adresi girin']
  },
  password: { type: String, required: true },
  role: {                     // ← bu satır eklendi
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, { timestamps: true });

// şifre hash’leme hook’u
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', UserSchema);

