const ottoman = require("ottoman");
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");
const db = require("../schema/db");
const { userModel } = require("../schema/models");
// const debug = require("debug")("app:service");
const {
  config: { sendgridApiKey, businessMail },
} = require("../config");
const randomString = require("../utils/functions/randomString");
const welcomeEmail = require("../utils/templates/welcomeEmail");

class UsersService {
  constructor() {
    this.limit = 50;
    this.skip = 0;
    sgMail.setApiKey(sendgridApiKey);
  }

  async createUser({ user }) {
    const {
      name: { first, last },
      document,
      email,
    } = user;
    const documentString = document.toString(10);
    const username = `${first.toLowerCase()}.${last.toLowerCase()}.${documentString.substring(
      documentString.length - 4,
      documentString.length
    )}`;
    const password = randomString(10);
    const hashedPassword = await bcrypt.hash(password, 10);
    const message = {
      to: email,
      from: businessMail,
      subject: "Welcome to Plus Medical",
      html: welcomeEmail({ name: first, username, password }),
    };
    await sgMail.send(message);
    return new Promise((resolve, reject) => {
      userModel.create(
        { ...user, username, password: hashedPassword },
        (err, data) => {
          if (err) return reject(err);
          resolve(data);
        }
      );
    });
  }

  getUser(key) {
    return new Promise((resolve, reject) => {
      if (isNaN(key)) {
        if (key.startsWith("@")) {
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
