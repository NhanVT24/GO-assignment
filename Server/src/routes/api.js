const express = require('express');
const {
  getScoreByRegistrationNumber,
  getTop10GroupA,
  getScoreStatistics,
} = require('../controllers/ScoreController');

const router = express.Router();

router.get('/scores/:registrationNumber', getScoreByRegistrationNumber);
router.get('/top-students', getTop10GroupA);
router.get('/statistics', getScoreStatistics);

module.exports = router;
