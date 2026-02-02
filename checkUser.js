require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./models/User'); // adjust path

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB Atlas');
    
    // Check all users
    const allUsers = await User.find({});
    console.log('Total users:', allUsers.length);
    console.log('All users:', allUsers);
    
    mongoose.connection.close();
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });