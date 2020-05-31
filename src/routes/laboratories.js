const express = require('express');

const router = express.Router();
const LaboratoriesService = require('../services/laboratories');
const auth = require('../utils/middlewares/auth');

const laboratoriesService = new LaboratoriesService();

router.get('/', auth(['administrator']), async (req, res, next) => {
  const { query, user: { role } } = req;
  try {
    const laboratories = await laboratoriesService.getLaboratories(query, role);
    res.status(200).json({ data: laboratories, message: 'Laboratories listed' });
  } catch (error) {
    next(error);
  }
});

router.get('/:key', async (req, res, next) => {
  const { key } = req.params;
  try {
    const laboratory = await laboratoriesService.getLaboratoryById(key);
    res.status(200).json({ data: laboratory, message: 'Laboratory retrieved' });
  } catch (error) {
    next(error);
  }
});

router.post('/', auth(['administrator']), async (req, res, next) => {
  const { body: laboratory } = req;
  try {
    const newLaboratory = await laboratoriesService.createLaboratory({ laboratory });
    res.status(201).json({ data: newLaboratory, message: 'Laboratory created' });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { body: laboratory } = req;
  try {
    const updateLaboratory = await laboratoriesService.updateLaboratory(id, { laboratory });
    res.status(200).json({ data: updateLaboratory, message: 'Laboratory update' });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const laboratory = await laboratoriesService.deleteLaboratory(id);
    res.status(200).json({ data: laboratory, message: 'Laboratory delete' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
