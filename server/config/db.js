import mongoose from 'mongoose';

export let isInMemory = false;

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/placeprep';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✅ MongoDB Connected to: ${conn.connection.host}/${conn.connection.name}`);
    isInMemory = false;
    return conn;
  } catch (err) {
    console.warn(`⚠️ MongoDB Connection failed: ${err.message}`);
    console.log('⚡ Initializing PlacePrep In-Memory High-Speed Document Engine...');
    isInMemory = true;
    return null;
  }
};