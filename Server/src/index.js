const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');
const apiRoutes = require('./routes/api');
const importCSVToMongoDB = require('./utils/csvParser');
const { rebuildReportCache } = require('./services/reportService');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
  });
});

const startServer = async () => {
  await connectDB();
  await importCSVToMongoDB();
  await rebuildReportCache();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
