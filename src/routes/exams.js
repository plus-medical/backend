const express = require('express');

const router = express.Router();
const ExamsService = require('../services/exams');
const auth = require('../utils/middlewares/auth');

const verbs = require('../utils/constants/responseVerbs');
const response = require('../utils/functions/response');
const roles = require('../utils/constants/roles');

const examsService = new ExamsService();
const entity = 'exam';

router.get(
  '/',
  auth([roles.ADMINISTRATOR, roles.DOCTOR, roles.LAB_WORKER]),
  async (req, res, next) => {
    const {
      query,
      user: { role },
    } = req;
    try {
      const exams = await examsService.getExams(query, role);
      response({
        entity,
        verb: verbs.LIST,
        data: exams,
        res,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/:key',
  auth([roles.ADMINISTRATOR, roles.DOCTOR, roles.LAB_WORKER]),
  async (req, res, next) => {
    const { key } = req.params;
    try {
      const exam = await examsService.getExamById(key);
      response({
        entity,
        verb: verbs.RETRIEVE,
        data: exam,
        res,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post('/', auth([roles.ADMINISTRATOR]), async (req, res, next) => {
  const { body: exam } = req;
  try {
    const newExam = await examsService.createExam({
      exam,
    });
    response({
      entity,
      verb: verbs.CREATE,
      data: newExam,
      res,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', auth([roles.ADMINISTRATOR]), async (req, res, next) => {
  const { id } = req.params;
  const { body: exam } = req;
  try {
    const updateExam = await examsService.updateExam(id, {
      exam,
    });
    response({
      entity,
      verb: verbs.UPDATE,
      data: updateExam,
      res,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', auth([roles.ADMINISTRATOR]), async (req, res, next) => {
  const { id } = req.params;
  try {
    const exam = await examsService.deleteExam(id);
    response({
      entity,
      verb: verbs.DELETE,
      data: exam,
      res,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
