
// routes/items.js
const router = require('express').Router();
const mongoose = require('mongoose');
const auth = require('../middleware/authMiddleware');
const Item = require('../models/Item');

// DELETE /api/items/:id
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  // 1. Geçerli ObjectId mi?
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
    //    Burada req.user.role tanımlıysa admin kontrolü ekleyebilirsiniz
    if (item.userId.toString() !== req.user.id /* sahibi değilse */ 
        /* && req.user.role !== 'admin' */) {
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
    // req.user.id comes from your authMiddleware after JWT verification
    const item = new Item({
      name: name.trim(),
      description: description.trim(),
      userId: req.user.id
    });

    console.log("MERHABA BEN GIT");
    await item.save();
    return res.status(201).json(item);
  } catch (err) {
    console.error('POST /api/items error:', err);
    return res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

// PUT EKLE

module.exports = router;
