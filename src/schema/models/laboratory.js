const ottoman = require('ottoman');

const laboratoryModel = ottoman.model(
  'Laboratory',
  {
    name: 'string',
    taxId: 'string',
    email: 'string',
    address: {
      street: 'string',
      city: 'string',
      state: 'string',
      zip: 'integer',
      country: { type: 'string', default: 'COL' },
    },
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
);

module.exports = laboratoryModel;
