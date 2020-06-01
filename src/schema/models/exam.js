const ottoman = require('ottoman');
// eslint-disable-next-line no-unused-vars
const db = require('../db');

const examModel = ottoman.model(
  'Exam',
  {
    name: 'string',
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
    },
  },
);

module.exports = examModel;
