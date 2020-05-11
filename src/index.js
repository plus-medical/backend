const express = require('express');
const debug = require('debug')('app:server');
const { config: { port } } = require('./config');
const initialRoutes = require('./routes');

const app = express();

initialRoutes(app);

app.listen(port, (err) => {
  if (err) debug(err);
  else debug(`Listening on http://localhost:${port}`);
});
