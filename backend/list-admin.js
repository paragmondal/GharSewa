const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gharsewa');
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      admin.password = 'password123';
      await admin.save();
      console.log(`Admin user email is: ${admin.email}`);
      console.log(`Password reset to: password123`);
    } else {
      console.log("No admin found!");
    }
  } catch (err) { }
  process.exit();
})();
