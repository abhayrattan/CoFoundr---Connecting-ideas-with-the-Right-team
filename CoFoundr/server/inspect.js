const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function inspectDB() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cofoundr');
  const users = await User.find({});
  console.log(`Found ${users.length} users`);
  for (let user of users) {
    console.log(`Email: ${user.email}, Password length: ${user.password.length}, starts with: ${user.password.substring(0, 10)}`);
  }
  process.exit(0);
}
inspectDB();
