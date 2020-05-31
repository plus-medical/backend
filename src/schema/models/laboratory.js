const ottoman = require('ottoman');
// eslint-disable-next-line no-unused-vars
const db = require('../db');
const examModel = require('./exam');

const laboratoryModel = ottoman.model(
  'Laboratory',
  {
    name: 'string',
    taxId: 'string',
    address: {
      street: 'string',
      city: 'string',
      state: 'string',
      zip: 'integer',
      country: { type: 'string', default: 'COL' },
    },
    email: 'string',
    phone: 'string',
    exams: [examModel],
    active: { type: 'boolean', default: true },
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
      findByDocument: {
        type: 'refdoc',
        by: 'taxId',
      },
    },
  },
);

module.exports = laboratoryModel;
