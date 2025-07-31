// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Eğer şifre hash'leme kullanıyorsanız

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, 'Lütfen geçerli bir e-posta adresi girin'],
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// (İsteğe bağlı) Şifreyi kaydetmeden önce hash’lemek için pre-save hook
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', UserSchema);
