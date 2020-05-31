const express = require('express');

const router = express.Router();
const UsersService = require('../services/users');
const validationHandler = require('../utils/middlewares/validationHandler');
const { createUserSchema } = require('../utils/validationSchemas/users');
const auth = require('../utils/middlewares/auth');

const userService = new UsersService();

router.get('/', auth(['administrator', 'doctor', 'lab-worker']), async (req, res, next) => {
  const { query, user: { role } } = req;
  try {
    const users = await userService.getUsers(query, role);
    res.status(200).json({ data: users, message: 'users listed' });
  } catch (error) {
    next(error);
  }
});

router.get('/:key', async (req, res, next) => {
  const { key } = req.params;
  try {
    const user = await userService.getUser(key);
    res.status(200).json({ data: user, message: 'user retrieved' });
  } catch (error) {
    next(error);
  }
});

router.post('/', validationHandler(createUserSchema), async (req, res, next) => {
  const { body: user } = req;
  try {
    const newUser = await userService.createUser({ user });
    res.status(201).json({ data: newUser, message: 'user created' });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { body: user } = req;
  try {
    const updateUser = await userService.updateUser(id, { user });
    res.status(200).json({ data: updateUser, message: 'user update' });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await userService.deleteUser(id);
    res.status(200).json({ data: user, message: 'user delete' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
