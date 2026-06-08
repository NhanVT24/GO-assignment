require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const importCSVToMongoDB = require('../utils/csvParser');
const { rebuildReportCache } = require('../services/reportService');

const run = async () => {
  try {
    await connectDB();
    await importCSVToMongoDB({
      skipIfDataExists: false,
      upsert: true,
    });
    await rebuildReportCache();
    console.log('Student sync finished.');
  } catch (error) {
    console.error('Student sync failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

run();
