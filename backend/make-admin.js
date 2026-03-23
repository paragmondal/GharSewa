const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gharsewa');
    // Find the first user or explicitly the user they are using (most likely the first one created)
    const user = await User.findOne();
    if (!user) {
      console.log("No users exist to make admin.");
      process.exit();
    }
    await User.findByIdAndUpdate(user._id, { role: 'admin' });
    console.log(`Successfully upgraded user: ${user.email} to Admin!`);
  } catch (err) {
    console.error(err);
  }
  process.exit();
})();
