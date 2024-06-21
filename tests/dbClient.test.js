const { expect } = require('chai');
const dbClient = require('../utils/db');

describe('dbClient', () => {
  it('should be able to connect to the database', (done) => {
    dbClient.client.db().admin().ping((err, result) => {
      expect(result).to.have.property('ok', 1);
      done();
    });
  });

  it('should have collections', async () => {
    const collections = await dbClient.client.db().listCollections().toArray();
    expect(collections).to.be.an('array');
  });

  after(() => dbClient.client.close());
});
