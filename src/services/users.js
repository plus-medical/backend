const ottoman = require('ottoman');
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
const Boom = require('@hapi/boom');
// eslint-disable-next-line no-unused-vars
const db = require('../schema/db');
const { userModel } = require('../schema/models');
const {
  config: { sendgridApiKey, businessMail },
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
    if (emailAlreadyExists.length > 0) {
      throw Boom.conflict('This email already exists');
    }
    if (documentAlreadyExists.length > 0) {
      throw Boom.conflict('This document already exists');
    }
    const username = await this.usernameGenerator({ first, last, document });
    const password = randomString(10);
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
}

module.exports = UsersService;
