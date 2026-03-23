const mongoose = require('mongoose');
require('dotenv').config();
const Provider = require('./src/models/Provider');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gharsewa');
  const provider = await Provider.findOne();
  if (!provider) {
    console.log("No provider found");
  } else {
    console.log("Found provider:", provider._id);
    const updated = await Provider.findByIdAndUpdate(provider._id, 
      { $set: { "availability.isAvailable": !provider.availability?.isAvailable } },
      { new: true, runValidators: false }
    );
    console.log("Updated provider isAvailable:", updated.availability?.isAvailable);
  }
  process.exit();
})();
