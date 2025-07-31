//routes/users.js
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User   = require('../models/User');
const auth   = require('../middleware/authMiddleware');   // JWT ara katmanı

/**
 * TOPLU KULLANICI OLUŞTURMA (SEED)
 * POST /api/users/seed
 * Body beklemez; aşağıdaki sabit diziyi kullanır.
 */
router.post('/seed', async (req, res) => {
  const initialUsers = [
    { username: 'abcde', email: 'ens3@example.com', password: 'ziraattk?!' },
    { username: 'user2',      email: 'user2@example.com',      password: 'pass2'      },
    { username: 'user3',      email: 'user3@example.com',      password: 'pass3'      },
    // ... dilediğin kadar kullanıcı ekle
  ];
  try {
    const seeded = await User.seedUsers(initialUsers);
    res.json({ message: 'Users seeded', seeded });
  } catch (err) {
    console.error('Seed hatası:', err);
    res.status(500).json({ message: 'Seed işlemi başarısız', error: err.message });
  }
});

/** ------------------------------------------------------------------
 * TÜM KULLANICILARI GETİR      GET /api/users
 * ------------------------------------------------------------------*/
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (err) {
    console.error('Kullanıcılar listelenemedi:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

/** ------------------------------------------------------------------
 * ID İLE KULLANICI GETİR       GET /api/users/:id
 * ------------------------------------------------------------------*/
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    res.json({ user });
  } catch (err) {
    console.error('Kullanıcı getirilemedi:', err);
    res.status(400).json({ message: 'Geçersiz ID' });
  }
});

/** ------------------------------------------------------------------
 * KULLANICI GÜNCELLE           PUT /api/users/:id
 * ------------------------------------------------------------------*/
router.put('/:id', auth, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const update = { username, email };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    res.json({ message: 'Güncellendi', user });
  } catch (err) {
    console.error('Kullanıcı güncellenemedi:', err);
    res.status(400).json({ message: err.message });
  }
});

/** ------------------------------------------------------------------
 * KULLANICI SİL                DELETE /api/users/:id
 * ------------------------------------------------------------------*/
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    res.json({ message: 'Silindi', user });
  } catch (err) {
    console.error('Kullanıcı silinemedi:', err);
    res.status(400).json({ message: 'Geçersiz ID' });
  }
});

module.exports = router;
