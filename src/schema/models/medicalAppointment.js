const ottoman = require('ottoman');

const userModel = ottoman.model(
  'ClinicHistory',
  {
    user: 'User',
    medical_history: 'string',
    opcupation: 'string',
    vulnerablePopulation: 'string',
    bloodType: 'string',
    responsible: {
      first: 'string',
      last: 'string',
      phone: 'string',
      relationship: 'string',
    },
    medicalAppointments : ['MedicalAppointment']
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
  },
);

module.exports = userModel;
