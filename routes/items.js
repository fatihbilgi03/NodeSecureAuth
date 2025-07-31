// routes/items.js
const router = require('express').Router();
const auth   = require('../middleware/authMiddleware');
const Item   = require('../models/Item');


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



// DELETE /api/items
// id’yi artık URL param değil, header’dan okuyacağız
router.delete('/', auth, async (req, res) => {
  // 1. ID’yi header’dan al
  const itemId = req.headers['x-item-id'];
  if (!itemId) {
    return res.status(400).json({ message: 'Header “x-item-id” eksik.' });
  }

  try {
    // 2. Geçerli ObjectId mi kontrol et (opsiyonel ama tavsiye edilir)
    if (!Item.schema.path('_id').casterConstructor.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: 'Geçersiz item ID.' });
    }

    // 3. Item’ı bul
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item bulunamadı.' });
    }

    // 4. Yetki kontrolü
    if (req.user.role !== 'admin' && item.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Bu işlemi yapmaya yetkiniz yok.' });
    }

    // 5. Sil
    await item.remove();
    res.json({ message: 'Ürün başarıyla silindi.' });
  } catch (err) {
    console.error('DELETE /api/items header-id error:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

// Item guncelleme



module.exports = router;
