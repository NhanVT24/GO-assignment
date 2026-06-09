const Student = require('../models/Student');
const Subject = require('../domain/Subject');
const ReportCache = require('../models/ReportCache');
const { findCsvRowByRegistrationNumber } = require('../utils/csvLookup');

let cachedStatistics = null;
let cachedTopStudents = null;

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

const getScoreByRegistrationNumber = async (req, res) => {
  try {
    const registrationNumber = req.params.registrationNumber.trim();

    if (!/^\d+$/.test(registrationNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Số báo danh chỉ được chứa số',
      });
    }

    const student = await Student.findOne({
      registration_number: registrationNumber,
    }).lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thí sinh',
      });
    }

    if (!student.foreign_language_code) {
      const csvRow = await findCsvRowByRegistrationNumber(registrationNumber);
      const foreignLanguageCode = csvRow?.ma_ngoai_ngu?.trim() || null;

      if (foreignLanguageCode) {
        student.foreign_language_code = foreignLanguageCode;
        await Student.updateOne(
          { registration_number: registrationNumber },
          { $set: { foreign_language_code: foreignLanguageCode } }
        );
      }
    }

    return res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server lỗi khi lấy điểm thi',
      error: error.message,
    });
  }
};

const getTop10GroupA = async (req, res) => {
  try {
    if (cachedTopStudents) {
      return res.json({
        success: true,
        data: cachedTopStudents,
        cached: true,
      });
    }

    const cachedReport = await ReportCache.findOne({ key: 'top_group_a' }).lean();

    if (cachedReport) {
      cachedTopStudents = cachedReport.data;

      return res.json({
        success: true,
        data: cachedTopStudents,
        cached: true,
      });
    }

    const students = await Student.findTop10GroupA();
    cachedTopStudents = students;

    await ReportCache.updateOne(
      { key: 'top_group_a' },
      { $set: { data: students } },
      { upsert: true }
    );

    return res.json({
      success: true,
      data: students,
      cached: false,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server lỗi khi lấy danh sách top 10',
      error: error.message,
    });
  }
};

const getScoreStatistics = async (req, res) => {
  try {
    if (cachedStatistics) {
      return res.json({
        success: true,
        data: cachedStatistics,
        cached: true,
      });
    }

    const subjects = Subject.all();
    const scoreLevels = Subject.scoreLevels();
    const cachedReport = await ReportCache.findOne({ key: 'score_statistics' }).lean();

    if (cachedReport) {
      cachedStatistics = cachedReport.data;

      return res.json({
        success: true,
        data: cachedStatistics,
        cached: true,
      });
    }

    const [aggregationResult = {}] = await Student.aggregate([
      {
        $group: buildStatisticsGroupStage(subjects),
      },
    ]);

    const statistics = subjects.map((subject) => ({
      subject: subject.key,
      label: subject.label,
      ranges: scoreLevels.map((level) => ({
        range: level.label,
        count: aggregationResult[`${subject.key}__${level.label}`] || 0,
      })),
    }));

    cachedStatistics = statistics;

    await ReportCache.updateOne(
      { key: 'score_statistics' },
      { $set: { data: statistics } },
      { upsert: true }
    );

    return res.json({
      success: true,
      data: statistics,
      cached: false,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server lỗi khi lấy điểm thống kê',
      error: error.message,
    });
  }
};

module.exports = {
  getScoreByRegistrationNumber,
  getTop10GroupA,
  getScoreStatistics,
};
