// routes/useritems.js
console.log('🟢 useritems router loaded');

const express  = require('express');
const router   = express.Router();
const auth     = require('../middleware/authMiddleware');
const UserItem = require('../models/ItemUser');
const Item     = require('../models/Item');

// 0) TÜM ATAMA KAYITLARINI LİSTELE
// GET /api/useritems
router.get('/', auth, async (req, res) => {
  try {
    const assignments = await UserItem
      .find()
      .populate('itemId')
      .populate('userId');
    return res.json(assignments);
  } catch (err) {
    console.error('GET /api/useritems error:', err);
    return res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// 1) POST /api/useritems — Atama oluştur
router.post('/', auth, async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    if (!userId || !itemId) {
      return res.status(400).json({ error: "userId ve itemId gereklidir" });
    }
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Sadece admin kullanıcı item atayabilir." });
    }
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: "Item bulunamadı." });
    }
    const alreadyAssigned = await UserItem.findOne({ itemId });
    if (alreadyAssigned) {
      return res.status(400).json({ error: "Bu item zaten bir kullanıcıya atanmış." });
    }
    const duplicate = await UserItem.findOne({ userId, itemId });
    if (duplicate) {
      return res.status(400).json({ error: "Bu item zaten bu kullanıcıya atanmış." });
    }
    const newAssignment = new UserItem({
      userId, itemId,
      createdBy: req.user.id,
      createdAt: new Date()
    });
    await newAssignment.save();
    await Item.findByIdAndUpdate(itemId, { userId });
    return res.status(201).json({ message: "Item kullanıcıya atandı." });
  } catch (err) {
    console.error('UserItem atama hatası:', err);
    return res.status(500).json({ error: "Sunucu hatası" });
  }
});

// 2) GET /api/useritems/:id — Tek bir atama kaydının detayları
router.get('/:id', auth, async (req, res) => {
  try {
    const assignment = await UserItem
      .findById(req.params.id)
      .populate('itemId')
      .populate('userId');
    if (!assignment) {
      return res.status(404).json({ error: 'Atama kaydı bulunamadı.' });
    }
    return res.json({
      itemUserId: assignment._id,
      item:       assignment.itemId,
      user:       assignment.userId,
      createdBy:  assignment.createdBy,
      createdAt:  assignment.createdAt
    });
  } catch (err) {
    console.error('GET /api/useritems/:id error:', err);
    return res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// 3) GET /api/useritems/user/:userId/items — Bir kullanıcının tüm item’ları
router.get('/user/:userId/items', auth, async (req, res) => {
  try {
    const assignments = await UserItem
      .find({ userId: req.params.userId })
      .populate('itemId');
    const items = assignments.map(a => a.itemId);
    return res.json({ userId: req.params.userId, items });
  } catch (err) {
    console.error('GET /api/useritems/user/:userId/items error:', err);
    return res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// ——— Yeni: Belirli bir item’ı kullanıcıya ata ———
router.post('/items/:itemId/assign', auth, async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId gereklidir.' });
  try {
    const exists = await UserItem.findOne({ itemId: req.params.itemId, userId });
    if (exists) return res.status(400).json({ error: 'Zaten atanmış.' });

    const assignment = new UserItem({
      userId,
      itemId: req.params.itemId,
      createdBy: req.user.id
    });
    await assignment.save();
    res.status(201).json(assignment);
  } catch (err) {
    console.error('POST /items/:itemId/assign error:', err);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// ——— Yeni: Kullanıcı-item ilişkilendirmesini kaldır ———
router.delete('/items/:itemId/assign/:userId', auth, async (req, res) => {
  try {
    await UserItem.deleteOne({
      itemId: req.params.itemId,
      userId: req.params.userId
    });
    res.json({ message: 'Atama kaldırıldı.' });
  } catch (err) {
    console.error('DELETE /items/:itemId/assign/:userId error:', err);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

module.exports = router;
