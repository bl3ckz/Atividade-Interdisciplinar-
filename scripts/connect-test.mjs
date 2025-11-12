import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import mongoose from 'mongoose';

async function main() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('Missing MONGODB_URI');

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 20000,
      appName: 'Multidisciplinar',
      bufferCommands: false,
    });
    console.log('MONGODB_OK');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('MONGODB_FAIL', (err && err.message) || err);
    process.exit(1);
  }
}

main();
