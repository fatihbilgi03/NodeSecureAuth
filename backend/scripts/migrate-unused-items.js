// scripts/migrate-unused-items.js
const mongoose = require('mongoose');
const User = require('../models/User');
const Item = require('../models/Item');
const UnusedItem = require('../models/UnusedItem');
// Veritabanına bağlan (URL ve ayarlar kendi ortamına göre düzenlenmeli)
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser:
true, useUnifiedTopology: true })
.then(async () => {
3
1
3
try {
console.log("Veritabanına bağlandı, veri taşıma başlıyor...");
// 1. userId alanı boş olan tüm item'ları çek (null veya tanımsızuserId).
const unassignedItems = await Item.find({
$or: [
{ userId: null },
{ userId: { $exists: false } }
]
});
console.log(`${unassignedItems.length} adet sahipsiz item bulundu.`);
// 2. Her bir sahipsiz item'ı UnusedItem koleksiyonuna kopyala ve asılkoleksiyondan sil.
for (let item of unassignedItems) {
// Item'ı düz JS objesine çevir
let itemData = item.toObject();
delete
itemData._id; // _id'yi silerek yeni koleksiyonda yeni bir idoluşturulmasını sağla
// UnusedItem modelinden yeni bir doküman oluştur ve alanları doldur
const unusedDoc = new UnusedItem(itemData);
await unusedDoc.save();
// Orijinal item'ı Item koleksiyonundan sil
await Item.deleteOne({ _id: item._id });
}
console.log("Taşıma işlemi tamamlandı!");
} catch (err) {
console.error("Taşıma sırasında hata oluştu:", err);
} finally {
mongoose.disconnect();
}
})
.catch(err => {
console.error("Veritabanına bağlanılamadı:", err);
});