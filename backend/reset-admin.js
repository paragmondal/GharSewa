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

async function resetAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');
    
    const email = 'admin@demo.com';
    const rawPassword = 'admin';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);
    
    let adminUser = await User.findOne({ email });
    if (adminUser) {
      adminUser.password = hashedPassword;
      await adminUser.save();
      console.log('Admin password reset successfully to: admin');
    } else {
      adminUser = new User({
        name: 'Super Admin',
        email,
        password: hashedPassword,
        role: 'admin'
      });
      await adminUser.save();
      console.log('Admin user recreated successfully with password: admin');
    }
    process.exit(0);
  } catch (err) {
    console.error('Error resetting admin:', err);
    process.exit(1);
  }
}
resetAdmin();
