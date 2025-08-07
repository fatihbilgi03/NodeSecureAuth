// Users/fatihbilgi/NodeSecureAuth/routes/auth.js
const router = require('express').Router();
const User   = require('../models/User');
const jwt    = require('jsonwebtoken'); // jsonwebtoken'ı içe aktar
const bcrypt = require('bcryptjs');    // bcryptjs'i içe aktar

// ===========================
// KULLANICI KAYDI (REGISTER)
// ===========================
router.post('/register', async (req, res) => {
  const { username, email, password,role } = req.body;

  try {
    // 1) Aynı e-posta ile kayıtlı kullanıcı var mı?
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: 'Bu e-posta adresi zaten kayıtlı.' });
    }

    // 2) Yeni kullanıcı oluştur
user = new User({ username, email, password, role });

    

    // 4) Kaydet ve başarılı yanıt dön
    await user.save();
    return res.status(201).json({
      message: 'Kullanıcı başarıyla kaydedildi.',
      user: {
        id:       user._id,
        username: user.username,
        email:    user.email
      }
    });

  } catch (err) {
    console.error('Kayıt hatası:', err);
    return res.status(500).json({
      message: 'Sunucu hatası: Kullanıcı kaydedilemedi.',
      error:   err.message
    });
  }
});

// ===========================
// KULLANICI GİRİŞİ (LOGIN)
// ===========================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1) E-posta ile kullanıcıyı bul
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Geçersiz kimlik bilgileri.' });
    }

    // 2) Şifreyi kontrol et
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: 'Geçersiz kimlik bilgileri.' });
    }

    // 3) JWT payload: id ve role
    const payload = {
      user: {
        id:   user.id,    // Token’a kullanıcı kimliğini ekle
        role: user.role   // ve kullanıcının rolünü de ekle
      }
    };





    
    // 4) Token’ı imzala ve gönder
    jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY,
      { expiresIn: '10h' },
      (err, token) => {
        if (err) throw err;
        return res.json({ token });
      }
    );

  } catch (err) {
    console.error('Giriş hatası:', err);
    return res.status(500).json({
      message: 'Sunucu hatası: Giriş yapılamadı.',
      error:   err.message
    });
  }
});

module.exports = router;
