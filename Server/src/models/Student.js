const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    registration_number: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    math: { type: Number, default: null },
    literature: { type: Number, default: null },
    english: { type: Number, default: null },
    physics: { type: Number, default: null },
    chemistry: { type: Number, default: null },
    biology: { type: Number, default: null },
    history: { type: Number, default: null },
    geography: { type: Number, default: null },
    civic_education: { type: Number, default: null },
    foreign_language_code: { type: String, default: null },
    total_group_a: { type: Number, default: 0, index: true },
  },
  {
    timestamps: false,
  }
);

studentSchema.methods.getGroupAScore = function() {
  return (this.math || 0) + (this.physics || 0) + (this.chemistry || 0);
};

studentSchema.statics.findTop10GroupA = async function() {
  const hasPrecomputedGroupA = await this.exists({
    total_group_a: { $gt: 0 },
  });

  if (!hasPrecomputedGroupA) {
    return await this.aggregate([
      {
        $project: {
          registration_number: 1,
          math: 1,
          physics: 1,
          chemistry: 1,
          totalGroupA: {
            $add: [
              { $ifNull: ['$math', 0] },
              { $ifNull: ['$physics', 0] },
              { $ifNull: ['$chemistry', 0] },
            ],
          },
        },
      },
      { $sort: { totalGroupA: -1 } },
      { $limit: 10 },
    ]);
  }

  const students = await this.find(
    {},
    {
      registration_number: 1,
      math: 1,
      physics: 1,
      chemistry: 1,
      total_group_a: 1,
    }
  )
    .sort({ total_group_a: -1 })
    .limit(10)
    .lean();

  return students.map((student) => ({
    ...student,
    totalGroupA: student.total_group_a,
  }));
};

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
