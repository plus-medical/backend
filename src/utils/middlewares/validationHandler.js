const Boom = require('@hapi/boom');
const Joi = require('@hapi/joi');

function validate(data, schema) {
  const { error } = Joi.object(schema).validate(data, schema);
  return error;
}

function validationHandler(schema, check = 'body') {
  return (req, res, next) => {
    const error = validate(req[check], schema);
    if (error) next(Boom.badRequest(error));
    else next();
  };
}

module.exports = validationHandler;
