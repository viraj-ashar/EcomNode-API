import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const url = process.env.MONGO_URL;

const dbConnect = async () => {
  try {
    mongoose.set('strictQuery', false);
    const connected = await mongoose.connect(url);
  } catch (err) {
    console.log(`Error ${err.message}`);
    process.exit(1);
  }
};

export default dbConnect;