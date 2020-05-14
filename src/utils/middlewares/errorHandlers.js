const Boom = require('@hapi/boom');
const debug = require('debug')('app:error');
const { config } = require('../../config');

const withErrorStack = (error, stack) => {
  if (config.dev) {
    return { ...error, stack };
  }
  return error;
};

const logErrors = (err, req, res, next) => {
  debug(err);
  next(err);
};

const wrapErrors = (err, req, res, next) => {
  if (!err.isBoom) {
    next(Boom.badImplementation(err));
  }
  next(err);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const { output: { statusCode, payload } } = err;
  res.status(statusCode);
  res.json(withErrorStack(payload, err.stack));
};

module.exports = {
  logErrors,
  wrapErrors,
  errorHandler,
};
