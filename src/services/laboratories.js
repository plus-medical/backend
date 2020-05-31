const ottoman = require('ottoman');
const Boom = require('@hapi/boom');

const laboratoryModel = require('../schema/models/laboratory');

class LaboratoriesService {
  constructor() {
    this.model = laboratoryModel;
    this.limit = 50;
    this.skip = 0;
  }

  async getLaboratoryById(id) {
    return new Promise((resolve, reject) => {
      this.model.getById(id, (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      });
    });
  }

  async getLaboratoryByName(name) {
    return new Promise((resolve, reject) => {
      this.model.findByName(name, (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      });
    });
  }

  async getLaboratoryByDocument(document) {
    return new Promise((resolve, reject) => {
      this.model.findByDocument(document, (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      });
    });
  }

  getLaboratories(query, role) {
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

  async createLaboratory({ laboratory }) {
    const { document } = laboratory;
    const documentAlreadyExists = await this.getLaboratoryByDocument(document);

    if (documentAlreadyExists.length > 0) {
      throw Boom.conflict('This document already exists');
    }

    return new Promise((resolve, reject) => {
      this.model.create(laboratory, (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      });
    });
  }

  updateLaboratory(id, { laboratory }) {
    return new Promise((resolve, reject) => {
      this.model.getById(id, (error, result) => {
        if (error) reject(error);
        Object.entries(laboratory).forEach(([key, value]) => {
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

  deleteLaboratory(id) {
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

module.exports = LaboratoriesService;
