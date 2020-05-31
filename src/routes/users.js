const express = require('express');

const router = express.Router();
const UsersService = require('../services/users');
const auth = require('../utils/middlewares/auth');

const verbs = require('../utils/constants/responseVerbs');
const response = require('../utils/functions/response');
const roles = require('../utils/constants/roles');

const userService = new UsersService();
const entity = 'user';

router.get(
  '/',
  auth([roles.ADMINISTRATOR, roles.DOCTOR, roles.LAB_WORKER]),
  async (req, res, next) => {
    const {
      query,
      user: { role },
    } = req;
    try {
      const users = await userService.getUsers(query, role);
      response({
        entity,
        verb: verbs.LIST,
        data: users,
        res,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.get('/:key', async (req, res, next) => {
  const { key } = req.params;
  try {
    const user = await userService.getUser(key);
    response({
      entity,
      verb: verbs.RETRIEVE,
      data: user,
      res,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', auth([roles.ADMINISTRATOR]), async (req, res, next) => {
  const { body: user } = req;
  try {
    const newUser = await userService.createUser({ user });
    response({
      entity,
      verb: verbs.CREATE,
      data: newUser,
      res,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', auth([roles.ADMINISTRATOR]), async (req, res, next) => {
  const { id } = req.params;
  const { body: user } = req;
  try {
    const updateUser = await userService.updateUser(id, { user });
    response({
      entity,
      verb: verbs.UPDATE,
      data: updateUser,
      res,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', auth([roles.ADMINISTRATOR]), async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await userService.deleteUser(id);
    response({
      entity,
      verb: verbs.DELETE,
      data: user,
      res,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
