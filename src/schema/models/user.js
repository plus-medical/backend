const ottoman = require('ottoman');

const UserModel = ottoman.model(
  'User',
  {
    id: { type: 'string', readonly: true },
    type: 'string',
    person: { ref: 'Person' },
    password: 'string',
    photo: 'string',
    is_active: { type: 'boolean', default: true },
    last_login: { type: 'Date', default: new Date() },
    created_at: { type: 'Date', default: new Date(), readonly: true },
    update_at: { type: 'Date', default: new Date() },
  },
  {
    index: {
      findById: {
        by: 'id',
        type: 'refdoc',
      },
      findByDocument: {
        by: 'person.document',
      },
      findByActive: {
        by: 'is_active',
      },
    },
  },
);

module.exports = UserModel;
