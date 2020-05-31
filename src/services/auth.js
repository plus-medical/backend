const Boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UsersService = require('./users');

const {
  config: { authJwtSecret },
} = require('../config');

class AuthService {
  constructor() {
    this.users = new UsersService();
  }

  async signIn({ username, password }) {
    const key = { username };
    const usersArray = await this.users.getUserByUsername(key.username);
    if (usersArray.length === 0) throw Boom.unauthorized();
    const user = usersArray[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw Boom.unauthorized();
    const payload = {
      // eslint-disable-next-line no-underscore-dangle
      sub: user._id,
      role: user.role,
    };
    const token = jwt.sign(payload, authJwtSecret, { expiresIn: '60m' });
    return {
      token,
      user: {
        name: user.name,
        username: user.username,
        role: user.role,
      },
    };
  }
}

module.exports = AuthService;
