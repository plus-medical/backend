const express = require('express');
const debug = require('debug')('app:server');

const app = express();

const {
  config: { port },
} = require('./config');

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.listen(port, (err) => {
  if (err) debug(err);
  else debug(`Listening on http://localhost:${port}`);
});
