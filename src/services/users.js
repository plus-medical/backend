var ottoman = require('ottoman');
var db = require('../schema/db');
const { userModel } = require('../schema/models');
const debug = require('debug')('app:service');

class UsersService {
  constructor() {
    this.limit = 50;
    this.skip = 0;
  }

  createUser({ user }) {
    return new Promise(function (resolve, reject) {
      userModel.create(user, function (err, data) {
        if (err) return reject(err);
        resolve(data);
      });
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
          userModel.getById(key, function (err, data) {
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
      userModel.getById(id, function (err, data) {
        if (err) return reject(err);
        for (let [key, value] of Object.entries(user)) {
          data[key] = value;
        }
        data.save(function (err) {
          if (err) return reject(err);
          return resolve(data);
        });
      });
    });
  }

  deleteUser(id) {
    return new Promise((resolve, reject) => {
      userModel.getById(id, function (err, data) {
        if (err) return reject(err);
        data.deleted = true;
        data.save(function (err) {
          if (err) return reject(err);
          return resolve(data);
        });
      });
    });
  }
}

module.exports = UsersService;
