//Users/fatihbilgi/NodeSecureAuth/routes/auth.js
const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');     // jsonwebtoken'ı içe aktar
const bcrypt = require('bcryptjs');      // bcryptjs'i içe aktar

// Kullanıcı kaydı (register)
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Bu e-posta ile bir kullanıcının zaten var olup olmadığını kontrol et
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Bu e-posta adresi zaten kayıtlı.' });
    }

    // Yeni bir kullanıcı örneği oluştur. Şifre, User modelindeki pre-save hook tarafından hashlenecektir.
    user = new User({
      username,
      email,
      password
    });

    await user.save(); // Yeni kullanıcıyı veritabanına kaydet

    // Güvenlik için şifreyi hariç tutarak başarı yanıtı döndür
    res.status(201).json({ message: 'Kullanıcı başarıyla kaydedildi.', user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error('Kullanıcı kaydı hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası: Kullanıcı kaydedilemedi.', error: err.message });
  }
});

// Kullanıcı girişi (login)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // E-posta ile kullanıcıyı bul
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Geçersiz kimlik bilgileri.' });
    }

    // Sağlanan şifreyi veritabanındaki hashlenmiş şifre ile karşılaştır
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Geçersiz kimlik bilgileri.' });
    }

    // JWT oluştur
    const payload = {
      user: {
        id: user.id // Token'a kullanıcı kimliğini ekle
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY, //.env dosyasından gizli anahtarı al
      { expiresIn: '10h' }, // Token'ın geçerlilik süresi
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // Token'ı istemciye gönder
      }
    );
  } catch (err) {
    console.error('Giriş hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası: Giriş yapılamadı.', error: err.message });
  }
});

module.exports = router;