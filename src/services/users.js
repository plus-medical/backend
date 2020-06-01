const ottoman = require('ottoman');
const Boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

const userModel = require('../schema/models/user');
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
    return new Promise((resolve, reject) => {
      this.model.getById(id, (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      });
    });
  }

  async getUserByUsername(username) {
    return new Promise((resolve, reject) => {
      this.model.findByUsername(username, (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      });
    });
  }

  async getUserByDocument(document) {
    return new Promise((resolve, reject) => {
      this.model.findByDocument(document, (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      });
    });
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

  getUsers(query, role) {
    const filter = { ...query, deleted: false };
    const limit = filter.limit || this.limit;
    delete filter.limit;
    const skip = filter.skip || this.skip;
    delete filter.skip;

    if (role !== 'administrator') filter.role = 'patient';

    const options = { limit, skip, consistency: ottoman.Consistency.LOCAL };

    return new Promise((resolve, reject) => {
      this.model.find(filter, options, (error, result) => {
        if (error) reject(error);
        resolve(result);
      });
    });
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
    // const password = config.dev ? '12345' : randomString(10);
    const password = '12345';
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!config.disableSendmail) {
      await sendMail(
        email,
        'Welcome to Plus Medical',
        welcomeEmail({ name: first, username, password }),
      );
    }
    return new Promise((resolve, reject) => {
      this.model.create(
        { ...user, username, password: hashedPassword },
        (error, result) => {
          if (error) return reject(error);
          return resolve(result);
        },
      );
    });
  }

  updateUser(id, { user }) {
    return new Promise((resolve, reject) => {
      this.model.getById(id, (error, result) => {
        if (error) reject(error);
        Object.entries(user).forEach(([key, value]) => {
          // eslint-disable-next-line no-param-reassign
          result[key] = value;
        });
        result.save((err) => {
          if (err) reject(err);
          resolve(result);
        });
      });
    });
  }

  deleteUser(id) {
    return new Promise((resolve, reject) => {
      this.model.getById(id, (error, result) => {
        if (error) reject(error);
        // eslint-disable-next-line no-param-reassign
        result.deleted = true;
        result.save((err) => {
          if (err) reject(err);
          resolve(result);
        });
      });
    });
  }
}

module.exports = UsersService;
