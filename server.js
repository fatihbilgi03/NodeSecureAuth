// server.js
require('dotenv').config();      // ← en tepe

const express  = require('express');
const mongoose = require('mongoose');
const authRoutes  = require('./routes/auth');
const itemRoutes  = require('./routes/items');
const userRoutes  = require('./routes/users');
const auth        = require('./middleware/authMiddleware');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/items', auth, itemRoutes);
app.use('/api/users', auth, userRoutes);

async function startServer() {
  console.log('→ MONGO_URL is:', process.env.MONGO_URL);  // debug log
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB bağlandı.');
    app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor.`));
  } catch (err) {
    console.error('Bağlantı hatası:', err);
  }
}

startServer();
