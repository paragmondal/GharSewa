const axios = require('axios');
require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  try {
    const Provider = require('./src/models/Provider');
    const User = require('./src/models/User');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gharsewa');
    
    const p = await Provider.findOne();
    if (!p) return console.log("No provider");
    const u = await User.findById(p.userId);
    
    // Login to get token
    const resAuth = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: u.email,
      password: 'password123'
    });
    const token = resAuth.data.data.accessToken;
    
    console.log("Token:", token.slice(0, 10));
    
    // Call endpoint
    const resPatch = await axios.patch('http://localhost:5000/api/v1/providers/availability', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log("PATCH success, provider.availability:", resPatch.data.data.provider.availability);
  } catch (err) {
    console.log("Error:", err.response?.data || err.message);
  }
  process.exit();
})();
