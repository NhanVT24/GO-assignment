class Subject {
  constructor({ key, label, csvColumn, required = false }) {
    this.key = key;
    this.label = label;
    this.csvColumn = csvColumn;
    this.required = required;
  }

  static all() {
    return [
      new Subject({ key: 'math', label: 'Toán', csvColumn: 'toan', required: true }),
      new Subject({ key: 'literature', label: 'Ngữ văn', csvColumn: 'ngu_van', required: true }),
      new Subject({ key: 'english', label: 'Ngoại ngữ', csvColumn: 'ngoai_ngu', required: true }),
      new Subject({ key: 'physics', label: 'Vật lý', csvColumn: 'vat_li' }),
      new Subject({ key: 'chemistry', label: 'Hóa học', csvColumn: 'hoa_hoc' }),
      new Subject({ key: 'biology', label: 'Sinh học', csvColumn: 'sinh_hoc' }),
      new Subject({ key: 'history', label: 'Lịch sử', csvColumn: 'lich_su' }),
      new Subject({ key: 'geography', label: 'Địa lý', csvColumn: 'dia_li' }),
      new Subject({ key: 'civic_education', label: 'GDCD', csvColumn: 'gdcd' }),
    ];
  }

  static groupAKeys() {
    return ['math', 'physics', 'chemistry'];
  }

  static scoreLevels() {
    return [
      { label: '>= 8', query: (key) => ({ [key]: { $gte: 8 } }) },
      { label: '6 - < 8', query: (key) => ({ [key]: { $gte: 6, $lt: 8 } }) },
      { label: '4 - < 6', query: (key) => ({ [key]: { $gte: 4, $lt: 6 } }) },
      { label: '< 4', query: (key) => ({ [key]: { $ne: null, $lt: 4 } }) },
    ];
  }
}

module.exports = Subject;
