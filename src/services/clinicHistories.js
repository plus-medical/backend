const ottoman = require('ottoman');
const Boom = require('@hapi/boom');

const UsersService = require('./users');
const clinicHistoryModel = require('../schema/models/clinicHistory');

class ClinicHistoryService {
  constructor() {
    this.model = clinicHistoryModel;
    this.limit = 50;
    this.skip = 0;
    this.users = new UsersService();
  }

  async getClinicHistoryById(id) {
    return new Promise((resolve, reject) => {
      this.model.getById(id, (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      });
    });
  }

  async getClinicHistoryByUserDocument(document) {
    return new Promise((resolve, reject) => {
      this.model.findByUserDocument(document, (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      });
    });
  }

  getClinicHistory(query) {
    const filter = { ...query, deleted: false };
    const limit = filter.limit || this.limit;
    delete filter.limit;
    const skip = filter.skip || this.skip;
    delete filter.skip;

    const options = { limit, skip, consistency: ottoman.Consistency.LOCAL };

    return new Promise((resolve, reject) => {
      this.model.find(filter, options, (error, result) => {
        if (error) reject(error);
        resolve(result);
      });
    });
  }

  async createClinicHistory({ clinicHistory }) {
    const { document } = clinicHistory;
    const documentAlreadyExists = await this.getClinicHistoryByUserDocument(
      document,
    );

    if (documentAlreadyExists.length > 0) {
      throw Boom.conflict('This clinic history already exists');
    }

    const usersArray = await this.users.getUserByDocument(document);
    if (usersArray.length === 0) throw Boom.notFound('The user not found');

    const user = usersArray[0];

    const newClinicHistory = { ...clinicHistory, user };
    delete newClinicHistory.document;

    return new Promise((resolve, reject) => {
      this.model.create(newClinicHistory, (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      });
    });
  }

  updateClinicHistory(id, { clinicHistory }) {
    return new Promise((resolve, reject) => {
      this.model.getById(id, (error, result) => {
        if (error) reject(error);
        Object.entries(clinicHistory).forEach(([key, value]) => {
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

  deleteClinicHistory(id) {
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

module.exports = ClinicHistoryService;
