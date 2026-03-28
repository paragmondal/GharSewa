const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gharsewa');
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      console.log(`\n=== ADMIN CREDENTIALS ===`);
      console.log(`Name:     ${admin.name}`);
      console.log(`Email:    ${admin.email}`);
      console.log(`Password: password123`);
      console.log(`=========================\n`);
    } else {
      console.log("No admin found in database.");
    }
  } catch (err) { }
  process.exit();
})();
