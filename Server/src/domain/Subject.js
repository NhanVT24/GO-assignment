class Subject {
  constructor({ key, label, csvColumn, required = false }) {
    this.key = key;
    this.label = label;
    this.csvColumn = csvColumn;
    this.required = required;
  }

  static all() {
    return [
      new Subject({ key: 'math', label: 'Toan', csvColumn: 'toan', required: true }),
      new Subject({ key: 'literature', label: 'Ngu van', csvColumn: 'ngu_van', required: true }),
      new Subject({ key: 'english', label: 'Ngoai ngu', csvColumn: 'ngoai_ngu', required: true }),
      new Subject({ key: 'physics', label: 'Vat ly', csvColumn: 'vat_li' }),
      new Subject({ key: 'chemistry', label: 'Hoa hoc', csvColumn: 'hoa_hoc' }),
      new Subject({ key: 'biology', label: 'Sinh hoc', csvColumn: 'sinh_hoc' }),
      new Subject({ key: 'history', label: 'Lich su', csvColumn: 'lich_su' }),
      new Subject({ key: 'geography', label: 'Dia ly', csvColumn: 'dia_li' }),
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
