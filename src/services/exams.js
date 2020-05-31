const ottoman = require('ottoman');
const Boom = require('@hapi/boom');

const examModel = require('../schema/models/exam');

class ExamsService {
  constructor() {
    this.model = examModel;
    this.limit = 50;
    this.skip = 0;
  }

  async getExamById(id) {
    return new Promise((resolve, reject) => {
      this.model.getById(id, (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      });
    });
  }

  async getExamByName(name) {
    return new Promise((resolve, reject) => {
      this.model.findByName(name, (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      });
    });
  }

  getExams(query, role) {
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

  async createExam({ exam }) {
    const { name } = exam;
    const nameAlreadyExists = await this.getExamByName(name);

    if (nameAlreadyExists.length > 0) {
      throw Boom.conflict('This exam already exists');
    }

    return new Promise((resolve, reject) => {
      this.model.create(exam, (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      });
    });
  }

  updateExam(id, { exam }) {
    return new Promise((resolve, reject) => {
      this.model.getById(id, (error, result) => {
        if (error) reject(error);
        Object.entries(exam).forEach(([key, value]) => {
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

  deleteExam(id) {
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

module.exports = ExamsService;
