const ottoman = require('ottoman');
const { phoneValidator, roleValidator } = require('../../utils/validators');
var userModel = ottoman.model(
  'User',
  {
    username: 'string',
    role: { type: 'string', validator: roleValidator },
    documentType: 'string',
    document: 'number',
    name: {
      first: 'string',
      last: 'string',
    },
    email: 'string',
    password: 'string',
    birthdate: 'Date',
    gender: 'string',
    address: {
      street: 'string',
      city: 'string',
      state: 'string',
      zip: 'integer',
      country: { type: 'string', default: 'COL' },
    },
    phone: { type: 'string', validator: phoneValidator },
    photo: 'string',
    active: { type: 'boolean', default: true },
    lastLogin: {
      date: { type: 'Date', default: new Date() },
      ip: 'string',
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
      findByUsername: {
        by: 'username',
      },
      findByDocument: {
        type: 'refdoc',
        by: 'document',
      },
    },
  }
);

module.exports = userModel;
