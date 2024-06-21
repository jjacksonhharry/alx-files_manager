const { expect } = require('chai');
const redisClient = require('../utils/redis');

describe('redisClient', () => {
  before(() => redisClient.client.flushall());

  it('should be able to connect to Redis', (done) => {
    redisClient.client.set('test_key', 'test_value', (err, reply) => {
      expect(reply).to.equal('OK');
      done();
    });
  });

  it('should retrieve the correct value', (done) => {
    redisClient.client.get('test_key', (err, reply) => {
      expect(reply).to.equal('test_value');
      done();
    });
  });

  after(() => redisClient.client.quit());
});
