import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.models.User || mongoose.model('User', userSchema);

async function fixUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');
    
    // Explicitly update all accounts created by the backdoor scripts to have isActive: true
    const resultUser = await User.updateOne(
      { email: 'user@demo.com' },
      { $set: { isActive: true } }
    );
    console.log('User account activated:', resultUser.modifiedCount);

    const resultAdmin = await User.updateOne(
      { email: 'admin@demo.com' },
      { $set: { isActive: true } }
    );
    console.log('Admin account activated:', resultAdmin.modifiedCount);
    
    process.exit(0);
  } catch (err) {
    console.error('Error activating users:', err);
    process.exit(1);
  }
}

fixUsers();
