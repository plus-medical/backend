const express = require('express');
const uploadFile = require('../utils/functions/uploadFile');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { prefix } = req.body;
    const uploaded = await uploadFile(req.file, prefix);
    res.status(201).json({ data: { url: uploaded.Location }, message: 'AWS upload works!', statusCode: res.statusCode });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
