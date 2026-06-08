const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const Student = require('../models/Student');
const Subject = require('../domain/Subject');

const csvFilePath = path.join(__dirname, '../../data/diem_thi_thpt_2024.csv');
const batchSize = 5000;

const toNumber = (value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const number = Number.parseFloat(value);
  return Number.isNaN(number) ? null : number;
};

const mapCsvRowToStudent = (row) => {
  const scores = Subject.all().reduce((data, subject) => {
    data[subject.key] = toNumber(row[subject.csvColumn]);
    return data;
  }, {});

  return {
    registration_number: row.sbd ? row.sbd.trim() : '',
    foreign_language_code: row.ma_ngoai_ngu ? row.ma_ngoai_ngu.trim() : null,
    ...scores,
    total_group_a: (scores.math || 0) + (scores.physics || 0) + (scores.chemistry || 0),
  };
};

const saveBatch = async (batch, options) => {
  if (batch.length === 0) return;

  if (options.upsert) {
    await Student.bulkWrite(
      batch.map((student) => ({
        updateOne: {
          filter: { registration_number: student.registration_number },
          update: { $set: student },
          upsert: true,
        },
      })),
      { ordered: false }
    );
    return;
  }

  await Student.insertMany(batch, { ordered: false });
};

const importCSVToMongoDB = async (options = {}) => {
  const importOptions = {
    skipIfDataExists: true,
    upsert: false,
    ...options,
  };

  const count = await Student.countDocuments();

  if (importOptions.skipIfDataExists && count > 0) {
    console.log(`Database already has ${count} student records. Skip import.`);
    return { skipped: true, inserted: 0 };
  }

  if (!fs.existsSync(csvFilePath)) {
    throw new Error(`CSV file not found: ${csvFilePath}`);
  }

  let inserted = 0;
  let batch = [];

  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(csvFilePath).pipe(csv());

    stream.on('data', async (row) => {
      stream.pause();

      try {
        const student = mapCsvRowToStudent(row);

        if (student.registration_number) {
          batch.push(student);
        }

        if (batch.length >= batchSize) {
          await saveBatch(batch, importOptions);
          inserted += batch.length;
          console.log(`Processed ${inserted} records...`);
          batch = [];
        }

        stream.resume();
      } catch (error) {
        reject(error);
      }
    });

    stream.on('end', async () => {
      try {
        await saveBatch(batch, importOptions);
        inserted += batch.length;
        console.log(`Import completed. Processed ${inserted} records.`);
        resolve({ skipped: false, inserted });
      } catch (error) {
        reject(error);
      }
    });

    stream.on('error', reject);
  });
};

module.exports = importCSVToMongoDB;
