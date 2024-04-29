const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('./server.js'); // Assuming your Express app is in app.js

describe('Sample Web App Tests', () => {
  it('should render form page correctly', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .end((err, res) => {
        expect(res.text).to.contain('form');
        done();
      });
  });

  it('should submit data successfully', (done) => {
    const data = {
      name: 'Test User'
    };

    request(app)
      .get('/submit')
      .query(data)
      .expect(200)
      .end((err, res) => {
        expect(res.text).to.contain('data submitted successfully');
        done();
      });
  });

  // Add more test cases as needed
});
