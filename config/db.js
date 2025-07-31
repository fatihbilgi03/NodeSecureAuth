// config/db.js
const mongoose = require('mongoose');

// import your models – only go up one directory from ./config to reach ./models
const Item = require('../models/Item'); // doğru dizine göre ayarlayın
const User = require('../models/User');

// FUNCTION-RUN-GENERATED-CODE-START:connectDB
(async () => { console.log(await connectDB(/* OpenAI API key not provided */)); })();
// FUNCTION-RUN-GENERATED-CODE-END:connectDB

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
