const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/finora';

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(`[Finora MongoDB] Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn.connection;
  } catch (error) {
    console.error(`[Finora MongoDB] Connection Error: ${error.message}`);
    // Do not crash the entire process immediately; allow retries or graceful responses
    isConnected = false;
    return null;
  }
};

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('[Finora MongoDB] Disconnected from database.');
});

mongoose.connection.on('reconnected', () => {
  isConnected = true;
  console.log('[Finora MongoDB] Reconnected to database.');
});

module.exports = {
  connectDB,
  isConnected: () => isConnected,
  mongoose
};
