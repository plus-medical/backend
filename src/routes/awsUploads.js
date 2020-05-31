const express = require('express');
const uploadFile = require('../utils/functions/uploadFile');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const uploaded = await uploadFile(req.file, 'avatar');
    console.log('uploaded', uploaded);
    res.status(201).json({ message: 'AWS upload works!', statusCode: res.statusCode });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
