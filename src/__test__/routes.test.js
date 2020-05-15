const routes = require('../routes');
const testServer = require('../utils/testServer');

const request = testServer(routes);

describe('Main route', () => {
  test('Status code must be 200', () => {
    request.get('/api').then((response) => {
      expect(response.statusCode).toBe(200);
    });
  });
  test('A hello world must be returned', () => {
    request.get('/api').then((response) => {
      expect(response.text).toBe('Hello world!');
    });
  });
});
