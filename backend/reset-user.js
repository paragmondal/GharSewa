import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'provider', 'admin'], default: 'user' }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function resetUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');
    
    const email = 'user@demo.com';
    const rawPassword = 'user123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);
    
    let demoUser = await User.findOne({ email });
    if (demoUser) {
      demoUser.password = hashedPassword;
      await demoUser.save();
      console.log('Customer password reset successfully to:', rawPassword);
    } else {
      demoUser = new User({
        name: 'Demo Customer',
        email,
        password: hashedPassword,
        role: 'user'
      });
      await demoUser.save();
      console.log('Customer user recreated successfully with password:', rawPassword);
    }
    process.exit(0);
  } catch (err) {
    console.error('Error resetting user:', err);
    process.exit(1);
  }
}

resetUser();
