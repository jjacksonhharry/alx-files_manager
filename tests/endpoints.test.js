const request = require('supertest');
const { expect } = require('chai');
const app = require('../app'); // Adjust the path if necessary
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

describe('Endpoints', () => {
  let token;
  let userId;
  let fileId;

  before(async () => {
    await dbClient.client.db().dropDatabase();
    await redisClient.client.flushall();
  });

  describe('GET /status', () => {
    it('should return the status', (done) => {
      request(app)
        .get('/status')
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('redis');
          expect(res.body).to.have.property('db');
          done();
        });
    });
  });

  describe('GET /stats', () => {
    it('should return the stats', (done) => {
      request(app)
        .get('/stats')
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('users');
          expect(res.body).to.have.property('files');
          done();
        });
    });
  });

  describe('POST /users', () => {
    it('should create a new user', (done) => {
      request(app)
        .post('/users')
        .send({ email: 'test@test.com', password: 'password123' })
        .expect(201)
        .end((err, res) => {
          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('email', 'test@test.com');
          userId = res.body.id;
          done();
        });
    });
  });

  describe('GET /connect', () => {
    it('should authenticate the user', (done) => {
      request(app)
        .get('/connect')
        .auth('test@test.com', 'password123')
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('token');
          token = res.body.token;
          done();
        });
    });
  });

  describe('GET /disconnect', () => {
    it('should disconnect the user', (done) => {
      request(app)
        .get('/disconnect')
        .set('X-Token', token)
        .expect(204, done);
    });
  });

  describe('GET /users/me', () => {
    it('should return the user info', (done) => {
      request(app)
        .get('/users/me')
        .set('X-Token', token)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('id', userId);
          expect(res.body).to.have.property('email', 'test@test.com');
          done();
        });
    });
  });

  describe('POST /files', () => {
    it('should upload a file', (done) => {
      request(app)
        .post('/files')
        .set('X-Token', token)
        .attach('file', 'tests/image.png') // Ensure you have an image.png file in the tests directory
        .field('name', 'image.png')
        .field('type', 'image')
        .expect(201)
        .end((err, res) => {
          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('name', 'image.png');
          fileId = res.body.id;
          done();
        });
    });
  });

  describe('GET /files/:id', () => {
    it('should return the file info', (done) => {
      request(app)
        .get(`/files/${fileId}`)
        .set('X-Token', token)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('id', fileId);
          expect(res.body).to.have.property('name', 'image.png');
          done();
        });
    });
  });

  describe('GET /files', () => {
    it('should return the list of files', (done) => {
      request(app)
        .get('/files')
        .set('X-Token', token)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  describe('PUT /files/:id/publish', () => {
    it('should publish the file', (done) => {
      request(app)
        .put(`/files/${fileId}/publish`)
        .set('X-Token', token)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('isPublic', true);
          done();
        });
    });
  });

  describe('PUT /files/:id/unpublish', () => {
    it('should unpublish the file', (done) => {
      request(app)
        .put(`/files/${fileId}/unpublish`)
        .set('X-Token', token)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('isPublic', false);
          done();
        });
    });
  });

  describe('GET /files/:id/data', () => {
    it('should return the file data', (done) => {
      request(app)
        .get(`/files/${fileId}/data`)
        .set('X-Token', token)
        .expect(200, done);
    });

    it('should return the file data with size query', (done) => {
      request(app)
        .get(`/files/${fileId}/data?size=100`)
        .set('X-Token', token)
        .expect(200, done);
    });
  });
});
