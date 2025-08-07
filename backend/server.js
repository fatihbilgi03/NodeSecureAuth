// server.js
require('dotenv').config();

const express           = require('express');
const mongoose          = require('mongoose');
const cors              = require('cors');                // ← ekledik
const authRoutes        = require('./routes/auth');
const itemRoutes        = require('./routes/items');
const userRoutes        = require('./routes/users');
const userItemsRoutes   = require('./routes/useritems');
const auth              = require('./middleware/authMiddleware');

const app   = express();
const PORT  = process.env.PORT || 3000;

// 1) Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2) CORS ayarı (Vite'ın portu)
app.use(cors({
  origin: 'http://localhost:5173'
}));

// 3) Route’lar
app.use('/api/auth',      authRoutes);
app.use('/api/items',     auth, itemRoutes);
app.use('/api/users',     auth, userRoutes);
app.use('/api/useritems', auth, userItemsRoutes);

// 4) Server’ı ayağa kaldır
async function startServer() {
  console.log('→ MONGO_URL is:', process.env.MONGO_URL);
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB bağlandı.');
    app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor.`));
  } catch (err) {
    console.error('Bağlantı hatası:', err);
  }
}

startServer();
