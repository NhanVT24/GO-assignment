const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const csvFilePath = path.join(__dirname, '../../data/diem_thi_thpt_2024.csv');

const findCsvRowByRegistrationNumber = (registrationNumber) => {
  if (!fs.existsSync(csvFilePath)) {
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(csvFilePath).pipe(csv());
    let found = false;

    stream.on('data', (row) => {
      if (row.sbd && row.sbd.trim() === registrationNumber) {
        found = true;
        stream.destroy();
        resolve(row);
      }
    });

    stream.on('close', () => {
      if (!found) {
        resolve(null);
      }
    });

    stream.on('error', reject);
  });
};

module.exports = {
  findCsvRowByRegistrationNumber,
};
