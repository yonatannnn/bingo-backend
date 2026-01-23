import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { initializeCards } from '../game/cardGenerator';

dotenv.config();

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trial-bingo');
    console.log('✅ Connected to MongoDB');

    await initializeCards();
    console.log('✅ Cards initialized successfully');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();

