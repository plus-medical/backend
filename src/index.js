const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const debug = require('debug')('app:server');
const boolParser = require('express-query-boolean');
const multer = require('multer');
const { config: { port } } = require('./config');
const routes = require('./routes');
const { logErrors, wrapErrors, errorHandler } = require('./utils/middlewares/errorHandlers');
const notFoundHandler = require('./utils/middlewares/notFoundHandler');

const app = express();

// Middlewares
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(cookieParser());
app.use(multer({
  storage: multer.memoryStorage(),
}).single('file'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(boolParser());

// Routes
routes(app);

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
