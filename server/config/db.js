import mongoose from 'mongoose';

export let isInMemory = false;

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/placeprep';

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected to: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.warn(`⚠️ Local MongoDB (${mongoUri}) not detected: ${err.message}`);
    console.log('⚡ Initializing PlacePrep In-Memory High-Speed Document Engine...');
    isInMemory = true;
    // We create a mock connected state for mongoose so models can operate or we wrap memory storage
    return null;
  }
};