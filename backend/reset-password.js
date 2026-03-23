const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gharsewa');
    const user = await User.findOne({ email: 'parag@test.com' });
    if (!user) {
      console.log("No user found with parag@test.com");
      process.exit();
    }
    user.password = 'password123';
    await user.save();
    console.log("Password successfully reset!");
  } catch (err) {
    console.error(err);
  }
  process.exit();
})();
