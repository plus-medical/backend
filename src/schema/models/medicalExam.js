const ottoman = require('ottoman');

const medicalExamModel = ottoman.model('MedicalExam', {
  laboratory: 'Laboratory',
  medicalAppointment: 'MedicalAppointment',
  result: { description: 'string', file: 'string' },
  status: 'string',
  createdAt: {
    type: 'Date',
    default: new Date(),
    readonly: true,
  },
  updatedAt: {
    type: 'Date',
    default: new Date(),
    readonly: true,
  },
  deleted: { type: 'boolean', default: false },
});

module.exports = medicalExamModel;
