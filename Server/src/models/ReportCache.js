const mongoose = require('mongoose');

const reportCacheSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ReportCache = mongoose.model('ReportCache', reportCacheSchema);

module.exports = ReportCache;
