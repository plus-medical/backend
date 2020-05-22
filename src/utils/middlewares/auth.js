const Boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const { config: { authJwtSecret } } = require('../../config');

const auth = (roles) => (req, res, next) => {
  const { token } = req.cookies;
  console.log('token', token);
  if (!token) throw Boom.unauthorized('Token does not exist');
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
