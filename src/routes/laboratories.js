const express = require('express');

const router = express.Router();
const LaboratoriesService = require('../services/laboratories');
const auth = require('../utils/middlewares/auth');

const verbs = require('../utils/constants/responseVerbs');
const response = require('../utils/functions/response');
const roles = require('../utils/constants/roles');

const laboratoriesService = new LaboratoriesService();
const entity = 'laboratory';

router.get('/', auth([roles.ADMINISTRATOR]), async (req, res, next) => {
  const {
    query,
    user: { role },
  } = req;
  try {
    const laboratories = await laboratoriesService.getLaboratories(query, role);
    response({
      entity,
      verb: verbs.LIST,
      data: laboratories,
      res,
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:key',
  auth([roles.ADMINISTRATOR]),
  async (req, res, next) => {
    const { key } = req.params;
    try {
      const laboratory = await laboratoriesService.getLaboratoryById(key);
      response({
        entity,
        verb: verbs.RETRIEVE,
        data: laboratory,
        res,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post('/', auth([roles.ADMINISTRATOR]), async (req, res, next) => {
  const { body: laboratory } = req;
  try {
    const newLaboratory = await laboratoriesService.createLaboratory({
      laboratory,
    });
    response({
      entity,
      verb: verbs.CREATE,
      data: newLaboratory,
      res,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', auth([roles.ADMINISTRATOR]), async (req, res, next) => {
  const { id } = req.params;
  const { body: laboratory } = req;
  try {
    const updateLaboratory = await laboratoriesService.updateLaboratory(id, {
      laboratory,
    });
    response({
      entity,
      verb: verbs.UPDATE,
      data: updateLaboratory,
      res,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', auth([roles.ADMINISTRATOR]), async (req, res, next) => {
  const { id } = req.params;
  try {
    const laboratory = await laboratoriesService.deleteLaboratory(id);
    response({
      entity,
      verb: verbs.DELETE,
      data: laboratory,
      res,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
