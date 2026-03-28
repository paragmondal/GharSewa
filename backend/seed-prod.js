require('dotenv').config();
const mongoose = require('mongoose');
const serviceCatalogService = require('./src/services/ServiceCatalogService');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to Atlas Database...");
    await serviceCatalogService.seedDefaultServices();
    console.log("Successfully seeded pristine production database with core services.");
  } catch (err) {
    console.error(err.message);
  }
  process.exit();
})();
