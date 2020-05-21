const Boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const { config: { authJwtSecret } } = require('../../config');

const auth = (roles) => (req, res, next) => {
  if (!req.headers.authorization) throw Boom.unauthorized('Token does not exist');
  const token = req.headers.authorization.split(' ')[1];
  let payload;
  try {
    payload = jwt.verify(token, authJwtSecret);
  } catch (err) {
    throw Boom.unauthorized('Invalid token');
  }
  const { sub: id, role } = payload;
  if (roles) {
    if (typeof roles === 'string') {
      if (roles !== role) throw Boom.unauthorized('Access denied');
    } else {
      let isMatch = false;
      roles.forEach((element) => {
        if (element === role) isMatch = true;
      });
      if (!isMatch) throw Boom.unauthorized('Access denied');
    }
  }
  const user = {
    id,
    role,
  };
  req.user = user;
  next();
};

module.exports = auth;
