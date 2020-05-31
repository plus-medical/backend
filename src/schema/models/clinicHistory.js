const ottoman = require('ottoman');
// eslint-disable-next-line no-unused-vars
const db = require('../db');
const userModel = require('./user');

const clinicHistoryModel = ottoman.model(
  'ClinicHistory',
  {
    user: userModel,
    history: 'string',
    occupation: 'string',
    vulnerablePopulation: 'string',
    bloodType: 'string',
    responsable: {
      name: {
        first: 'string',
        last: 'string',
      },
      relationship: 'string',
      phone: 'string',
    },
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
  {
    index: {
      findByName: {
        by: 'name',
      },
    },
  },
);

module.exports = clinicHistoryModel;
