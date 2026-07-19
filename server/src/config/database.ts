import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer | null = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  const mongoUri = process.env.MONGODB_URI?.trim();

  try {
    if (mongoUri) {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('✓ MongoDB connected successfully');
      return true;
    }

    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log('✓ MongoDB connected successfully using in-memory MongoDB');
    return true;
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error);
    return false;
  }
};

export default connectDB;
