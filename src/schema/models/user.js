const ottoman = require('ottoman');
// eslint-disable-next-line no-unused-vars
const db = require('../db');
const laboratoryModel = require('./laboratory');
const { phoneValidator, roleValidator } = require('../../utils/validators');

const userModel = ottoman.model(
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

    insuranceCarrier: 'string',
    bondingType: 'string',
    maritalStatus: 'string',

    speciality: 'string',

    laboratory: laboratoryModel,

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
  },
);

module.exports = userModel;
