require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const importCSVToMongoDB = require('../utils/csvParser');

const run = async () => {
  try {
    await connectDB();
    await importCSVToMongoDB();
    console.log('Seeder finished.');
  } catch (error) {
    console.error('Seeder failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

run();
