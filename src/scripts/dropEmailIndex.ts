import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function dropEmailIndex() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trial-bingo');
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    if (!db) {
      console.error('❌ Database connection not available');
      process.exit(1);
      return;
    }

    const collections = await db.listCollections().toArray();
    
    const userCollection = collections.find((col) => col.name === 'users');
    if (userCollection) {
      try {
        await db.collection('users').dropIndex('email_1');
        console.log('✅ Dropped email_1 index');
      } catch (error: any) {
        if (error.codeName === 'IndexNotFound') {
          console.log('ℹ️  email_1 index does not exist');
        } else {
          console.error('❌ Error dropping index:', error);
        }
      }
    }

    // Also try test database
    try {
      await db.collection('users').dropIndex('email_1');
      console.log('✅ Dropped email_1 index from test database');
    } catch (error: any) {
      if (error.codeName === 'IndexNotFound') {
        console.log('ℹ️  email_1 index does not exist in test database');
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

dropEmailIndex();


