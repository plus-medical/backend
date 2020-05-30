const ottoman = require('ottoman');
const db = require('../db');

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
      findByTaxId: {
        type: 'refdoc',
        by: 'taxId',
      },
    },
  },
);

module.exports = laboratoryModel;
