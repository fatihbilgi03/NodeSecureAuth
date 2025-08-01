const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');        // JWT kimlik doğrulama middleware'i
const UserItem = require('../models/UserItem');    // UserItem modeli (Mongoose)

// POST /api/useritems - Kullanıcıya item atama endpoint'i
router.post('/', auth, async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        // İstek gövdesinde userId ve itemId bulunmalı
        if (!userId || !itemId) {
            return res.status(400).json({ error: "userId ve itemId gereklidir" });
        }

        // Aynı userId & itemId ile daha önce atama yapıldı mı kontrol et
        const mevcutAtama = await UserItem.findOne({ userId: userId, itemId: itemId });
        if (mevcutAtama) {
            return res.status(400).json({ error: "Bu item zaten bu kullanıcıya atanmış" });
        }

        // Yeni UserItem belgesi oluştur ve kaydet
        const yeniAtama = new UserItem({
            userId: userId,
            itemId: itemId,
            createdBy: req.user.id,   // giriş yapan kullanıcının ID'si (JWT token'dan)
            createdAt: new Date()     // oluşturulma zamanı
        });
        await yeniAtama.save();

        // Başarılı cevap
        res.status(201).json({ message: "Item kullanıcıya atandı" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Sunucu hatası" });
    }
});

module.exports = router;
