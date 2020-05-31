const express = require('express');

const router = express.Router();
const ClinicHistoriesService = require('../services/clinicHistories');
const auth = require('../utils/middlewares/auth');

const verbs = require('../utils/constants/responseVerbs');
const response = require('../utils/functions/response');
const roles = require('../utils/constants/roles');

const clinicHistoriesService = new ClinicHistoriesService();
const entity = 'clinicHistory';

router.get('/', auth([roles.DOCTOR]), async (req, res, next) => {
  const {
    query,
    user: { role },
  } = req;
  try {
    const clinicHistories = await clinicHistoriesService.getClinicHistories(
      query,
      role,
    );
    response({
      entity,
      verb: verbs.LIST,
      data: clinicHistories,
      res,
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:key',
  auth([roles.DOCTOR, roles.PATIENT]),
  async (req, res, next) => {
    const { key } = req.params;
    try {
      const clinicHistory = await clinicHistoriesService.getClinicHistoryById(
        key,
      );
      response({
        entity,
        verb: verbs.RETRIEVE,
        data: clinicHistory,
        res,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post('/', auth([roles.DOCTOR]), async (req, res, next) => {
  const { body: clinicHistory } = req;
  try {
    const newClinicHistory = await clinicHistoriesService.createClinicHistory({
      clinicHistory,
    });
    response({
      entity,
      verb: verbs.CREATE,
      data: newClinicHistory,
      res,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', auth([roles.DOCTOR]), async (req, res, next) => {
  const { id } = req.params;
  const { body: clinicHistory } = req;
  try {
    const updateClinicHistory = await clinicHistoriesService.updateClinicHistory(id, {
      clinicHistory,
    });
    response({
      entity,
      verb: verbs.UPDATE,
      data: updateClinicHistory,
      res,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', auth([roles.ADMINISTRATOR]), async (req, res, next) => {
  const { id } = req.params;
  try {
    const clinicHistory = await clinicHistoriesService.deleteClinicHistory(id);
    response({
      entity,
      verb: verbs.DELETE,
      data: clinicHistory,
      res,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
