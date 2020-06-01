const express = require('express');
const readFile = require('../utils/functions/readFile');

const router = express.Router();

const response = require('../utils/functions/response');
const verbs = require('../utils/constants/responseVerbs');

const UsersService = require('../services/users');

const userService = new UsersService();

router.post('/', async (req, res, next) => {
  try {
    const users = readFile(req.file);
    const entity = 'user';
    const usersPromises = users.map(async (user) => userService.createUser({ user }));

    const newUsers = await Promise.all(usersPromises);

    response({
      entity,
      verb: verbs.CREATE,
      data: newUsers,
      res,
    });
  } catch (err) {
    next();
  }
});

module.exports = router;
