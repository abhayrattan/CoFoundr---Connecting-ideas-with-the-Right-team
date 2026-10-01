const mongoose = require('mongoose');
const User = require('./server/models/User');
require('dotenv').config({ path: './server/.env' });

async function inspectDB() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cofoundr');
  const users = await User.find({});
  console.log(`Found ${users.length} users`);
  for (let user of users) {
    console.log(`Email: ${user.email}, Password length: ${user.password.length}, starts with: ${user.password.substring(0, 7)}`);
  }
  process.exit(0);
}
inspectDB();
