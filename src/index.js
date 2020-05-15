const express = require('express');
const debug = require('debug')('app:server');
const { config: { port } } = require('./config');
const initialRoutes = require('./routes');
const { logErrors, wrapErrors, errorHandler } = require('./utils/middlewares/errorHandlers');
const notFoundHandler = require('./utils/middlewares/notFoundHandler');

const app = express();

app.use(express.json());

// Routes
initialRoutes(app);

// Catch 404
app.use(notFoundHandler);

// Handle Errors
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

// Server
app.listen(port, (err) => {
  if (err) debug(err);
  else debug(`Listening on http://localhost:${port}`);
});
