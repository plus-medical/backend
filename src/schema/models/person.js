const ottoman = require('ottoman');
const phoneValidator = require('../../utils/validators').default;

const PersonModel = ottoman.model(
  'Person',
  {
    id: { type: 'string', readonly: true },
    type: 'string',
    document_type: 'string',
    document: 'string',
    name: {
      first: 'string',
      last: 'string',
    },
    email: 'string',
    birthday: 'Date',
    gender: 'string',
    address: {
      street: 'string',
      city: 'string',
      state: 'string',
      zip: 'integer',
      country: { type: 'string', default: 'COL' },
    },
    phone_number: { type: 'string', validator: phoneValidator },
  },
  {
    index: {
      findById: {
        by: 'id',
        type: 'refdoc',
      },
      findByDocument: {
        by: 'document',
        type: 'refdoc',
      },
      findByFirstName: {
        by: 'name.first',
      },
      findByLastName: {
        by: 'name.last',
      },
    },
  },
);

module.exports = PersonModel;
