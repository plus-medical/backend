function response({
  entity, verb, data, res,
}) {
  let message;
  let statusCode;
  if (verb === 'list') {
    message = `${verb} of ${entity}s`;
  } else {
    message = `${entity} ${verb}d successfully`;
  }
  if (verb === 'create') {
    statusCode = 201;
  } else {
    statusCode = 200;
  }
  const result = {
    message,
    statusCode,
  };
  if (data) {
    result.data = data;
  }
  res.status(statusCode).json(result);
}

module.exports = response;
