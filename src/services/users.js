const ottoman = require('ottoman');
const Boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

const promise2asyncAwait = require('../utils/functions/promise2asyncAwait');
const userModel = require('..');
const randomString = require('../utils/functions/randomString');
const sendMail = require('../utils/sendMail');
const welcomeEmail = require('../utils/templates/welcomeEmail');

const { config } = require('../config');

class UsersService {
  constructor() {
    this.model = userModel;
    this.limit = 50;
    this.skip = 0;
  }

  async getUserById(id) {
    return promise2asyncAwait(id, this.model.getById);
  }

  async getUserByUsername(username) {
    return promise2asyncAwait(username, this.model.findByUsername);
  }

  async getUserByDocument(document) {
    return promise2asyncAwait(document, this.model.findByDocument);
  }

  async getUser(key) {
    if (isNaN(key)) {
      if (key.startsWith('@')) {
        const username = key.slice(1);
        return this.getUserByUsername(username);
      }
      return this.getUserById(key);
    }
    return this.getUserByDocument(key);
  }

  async getUsers(query) {
    const filter = { ...query, deleted: false };
    const limit = filter.limit || this.limit;
    delete filter.limit;
    const skip = filter.skip || this.skip;
    delete filter.skip;

    const options = { limit, skip, consistency: ottoman.Consistency.LOCAL };

    return promise2asyncAwait(filter, this.model.find, options);
  }

  async usernameGenerator({ first, last, document }) {
    const documentString = document.toString(10);
    let aux = true;
    let username;
    do {
      let digits;
      if (!username) {
        digits = documentString.substring(
          documentString.length - 4,
          documentString.length,
        );
      } else {
        digits = randomString(4, 'number');
      }
      username = `${first.toLowerCase()}.${last.toLowerCase()}.${digits}`;
      // eslint-disable-next-line no-await-in-loop
      const usernameAlreadyExists = await this.getUserByUsername(username);
      if (usernameAlreadyExists.length === 0) aux = false;
    } while (aux);
    return username;
  }

  async createUser({ user }) {
    const {
      name: { first, last },
      document,
      email,
    } = user;
    const [emailAlreadyExists, documentAlreadyExists] = await Promise.all([
      this.getUsers({ email }),
      this.getUsers({ document }),
    ]);
    if (documentAlreadyExists.length > 0) {
      throw Boom.conflict('This document already exists');
    }
    if (emailAlreadyExists.length > 0) {
      throw Boom.conflict('This email already exists');
    }
    const username = await this.usernameGenerator({ first, last, document });
    const password = config.dev ? '12345' : randomString(10);
    const hashedPassword = await bcrypt.hash(password, 10);

    await sendMail(email, 'Welcome to Plus Medical', welcomeEmail({ name: first, username, password }));

    return promise2asyncAwait({ ...user, username, password: hashedPassword }, this.model.create);
  }
}

module.exports = UsersService;

/*
const ottoman = require('ottoman');
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
const Boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
// eslint-disable-next-line no-unused-vars
const db = require('../schema/db');
const { userModel } = require('../schema/models');
const {
  config: {
    sendgridApiKey, businessMail, authJwtSecret, dev,
  },
} = require('../config');
const randomString = require('../utils/functions/randomString');
const welcomeEmail = require('../utils/templates/welcomeEmail');

class UsersService {
  constructor() {
    this.limit = 50;
    this.skip = 0;
    sgMail.setApiKey(sendgridApiKey);
  }

  async usernameGenerator({ first, last, document }) {
    const documentString = document.toString(10);
    let aux = true;
    let username;
    do {
      let digits;
      if (!username) {
        digits = documentString.substring(
          documentString.length - 4,
          documentString.length,
        );
      } else {
        digits = randomString(4, 'number');
      }
      username = `${first.toLowerCase()}.${last.toLowerCase()}.${digits}`;
      // eslint-disable-next-line no-await-in-loop
      const usernameAlreadyExists = await this.getUsers({ username });
      if (usernameAlreadyExists.length === 0) aux = false;
    } while (aux);
    return username;
  }

  async createUser({ user }) {
    const {
      name: { first, last },
      document,
      email,
    } = user;
    const [
      emailAlreadyExists,
      documentAlreadyExists,
    ] = await Promise.all([
      this.getUsers({ email }),
      this.getUsers({ document }),
    ]);
    if (documentAlreadyExists.length > 0) {
      throw Boom.conflict('This document already exists');
    }
    if (emailAlreadyExists.length > 0) {
      throw Boom.conflict('This email already exists');
    }
    const username = await this.usernameGenerator({ first, last, document });
    const password = dev ? '12345' : randomString(10);
    const hashedPassword = await bcrypt.hash(password, 10);
    const message = {
      to: email,
      from: businessMail,
      subject: 'Welcome to Plus Medical',
      html: welcomeEmail({ name: first, username, password }),
    };
    await sgMail.send(message);
    return new Promise((resolve, reject) => {
      userModel.create(
        { ...user, username, password: hashedPassword },
        (err, data) => {
          if (err) return reject(err);
          return resolve(data);
        },
      );
    });
  }

  getUser(key) {
    return new Promise((resolve, reject) => {
      if (isNaN(key)) {
        if (key.startsWith('@')) {
          const username = key.slice(1);
          userModel.findByUsername(username, (err, data) => {
            if (err) return reject(err);
            return resolve(data);
          });
        } else {
          userModel.getById(key, (err, data) => {
            if (err) return reject(err);
            return resolve(data);
          });
        }
      } else {
        userModel.findByDocument(key, (err, data) => {
          if (err) return reject(err);
          return resolve(data);
        });
      }
    });
  }

  getUsers(query) {
    const filter = { ...query, deleted: false };
    const limit = filter.limit || this.limit;
    delete filter.limit;
    const skip = filter.skip || this.skip;
    delete filter.skip;

    const options = { limit, skip, consistency: ottoman.Consistency.LOCAL };

    return new Promise((resolve, reject) => {
      userModel.find(filter, options, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  }

  updateUser(id, { user }) {
    return new Promise((resolve, reject) => {
      userModel.getById(id, (err, data) => {
        if (err) return reject(err);
        for (const [key, value] of Object.entries(user)) {
          data[key] = value;
        }
        data.save((err) => {
          if (err) return reject(err);
          return resolve(data);
        });
      });
    });
  }

  deleteUser(id) {
    return new Promise((resolve, reject) => {
      userModel.getById(id, (err, data) => {
        if (err) return reject(err);
        data.deleted = true;
        data.save((err) => {
          if (err) return reject(err);
          return resolve(data);
        });
      });
    });
  }

  async signinService({ username, password }) {
    const usersArray = await this.getUsers({ username });
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

module.exports = UsersService;
*/
