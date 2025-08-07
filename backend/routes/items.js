// routes/items.js
const router = require('express').Router();
const mongoose = require('mongoose');
const auth = require('../middleware/authMiddleware');
const Item = require('../models/Item');
// Yeni satır: ilişkisel atamaları sorgulamak için
const UserItem = require('../models/ItemUser');

// DELETE /api/items/:id
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Geçersiz item ID.' });
  }

  try {
    // 2. Item'ı bul
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item bulunamadı.' });
    }

    // 3. Yetki kontrolü: sadece sahibi veya admin silebilir
    if (item.userId.toString() !== req.user.id /* sahibi değilse */) {
      return res.status(403).json({ message: 'Bu işlemi yapmaya yetkiniz yok.' });
    }

    // 4. Silme işlemi
    await item.deleteOne();
    return res.status(200).json({ message: 'Item başarıyla silindi.' });
  } catch (err) {
    console.error('DELETE /api/items/:id error:', err);
    return res.status(500).json({ message: 'Sunucu hatası.' });
  }
});


// POST /api/items
// body: { name: string, description?: string }
router.post('/', auth, async (req, res) => {
  const { name, description = '' } = req.body;

  if (!name.trim()) {
    return res.status(400).json({ message: 'Ürün adı (name) zorunlu.' });
  }

  try {
    const item = new Item({
      name: name.trim(),
      description: description.trim(),
      userId: req.user.id
    });
    await item.save();
    return res.status(201).json(item);
  } catch (err) {
    console.error('POST /api/items error:', err);
    return res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

// PUT /api/items/:id
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Geçersiz item ID.' });
  }

  try {
    const item = await Item.findByIdAndUpdate(
      id,
      { name: name?.trim(), description: description?.trim() },
      { new: true, runValidators: true }
    );
    if (!item) {
      return res.status(404).json({ message: 'Item bulunamadı.' });
    }
    return res.json(item);
  } catch (err) {
    console.error('PUT /api/items/:id error:', err);
    return res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

// GET /api/items/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item bulunamadı.' });
    return res.json(item);
  } catch (err) {
    console.error('GET /api/items/:id error:', err);
    return res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

// ——— Yeni: Bir item’a atanmış kullanıcıları getir ———
router.get('/:id/users', auth, async (req, res) => {
  try {
    const assignments = await UserItem
      .find({ itemId: req.params.id })
      .populate('userId');
    const users = assignments.map(a => a.userId);
    res.json({ itemId: req.params.id, users });
  } catch (err) {
    console.error('GET /:id/users error:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

module.exports = router;
