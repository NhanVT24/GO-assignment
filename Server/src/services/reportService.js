const ReportCache = require('../models/ReportCache');
const Student = require('../models/Student');
const Subject = require('../domain/Subject');

const buildLevelCounters = (field) => ({
  '>= 8': {
    $sum: {
      $cond: [{ $gte: [`$${field}`, 8] }, 1, 0],
    },
  },
  '6 - < 8': {
    $sum: {
      $cond: [
        {
          $and: [
            { $gte: [`$${field}`, 6] },
            { $lt: [`$${field}`, 8] },
          ],
        },
        1,
        0,
      ],
    },
  },
  '4 - < 6': {
    $sum: {
      $cond: [
        {
          $and: [
            { $gte: [`$${field}`, 4] },
            { $lt: [`$${field}`, 6] },
          ],
        },
        1,
        0,
      ],
    },
  },
  '< 4': {
    $sum: {
      $cond: [
        {
          $and: [
            { $ne: [`$${field}`, null] },
            { $lt: [`$${field}`, 4] },
          ],
        },
        1,
        0,
      ],
    },
  },
});

const buildStatisticsGroupStage = (subjects) => {
  const groupStage = {
    _id: null,
  };

  subjects.forEach((subject) => {
    const counters = buildLevelCounters(subject.key);

    Object.entries(counters).forEach(([level, expression]) => {
      groupStage[`${subject.key}__${level}`] = expression;
    });
  });

  return groupStage;
};

const buildScoreStatistics = async () => {
  const subjects = Subject.all();
  const scoreLevels = Subject.scoreLevels();
  const [aggregationResult = {}] = await Student.aggregate([
    {
      $group: buildStatisticsGroupStage(subjects),
    },
  ]);

  return subjects.map((subject) => ({
    subject: subject.key,
    label: subject.label,
    ranges: scoreLevels.map((level) => ({
      range: level.label,
      count: aggregationResult[`${subject.key}__${level.label}`] || 0,
    })),
  }));
};

const rebuildReportCache = async () => {
  const [statistics, topStudents] = await Promise.all([
    buildScoreStatistics(),
    Student.findTop10GroupA(),
  ]);

  await Promise.all([
    ReportCache.updateOne(
      { key: 'score_statistics' },
      { $set: { data: statistics } },
      { upsert: true }
    ),
    ReportCache.updateOne(
      { key: 'top_group_a' },
      { $set: { data: topStudents } },
      { upsert: true }
    ),
  ]);

  return {
    statistics,
    topStudents,
  };
};

module.exports = {
  buildScoreStatistics,
  rebuildReportCache,
};
