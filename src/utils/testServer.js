const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const supertest = require('supertest');

const testServer = (route) => {
  const app = express();
  route(app);
  return supertest(app);
};

module.exports = testServer;
