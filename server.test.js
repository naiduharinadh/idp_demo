const assert = require('assert');
const request = require('supertest');
const app = require('./server.js'); // Assuming your Express app is in server.js

describe('Express App Tests', () => {
  it('should render the form page correctly', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        assert.strictEqual(res.text.includes('this is from the k8s cluster--- modified line to detect the jenkins'), true);
        done();
      });
  });

  it('should submit data successfully', (done) => {
    const testName = 'Test User';

    request(app)
      .get('/submit')
      .query({ name: testName })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        assert.strictEqual(res.text.includes('data submitted successfully'), true);
        done();
      });
  });



});
