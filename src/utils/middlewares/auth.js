const Boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const { config: { authJwtSecret } } = require('../../config');

const auth = (req, res, next) => {
  if (!req.headers.authorization) throw Boom.unauthorized('Token does not exist');
  const token = req.headers.authorization.split(' ')[1];
  let payload;
  try {
    payload = jwt.verify(token, authJwtSecret);
  } catch (err) {
    throw Boom.unauthorized('Invalid token');
  }
  const { sub: id, role } = payload;
  const user = {
    id,
    role,
  };
  req.user = user;
  next();
};

module.exports = auth;
