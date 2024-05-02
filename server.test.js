const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("./server"); // Assuming your Express app is in server.js
const expect = chai.expect;

chai.use(chaiHttp);

describe("Express App", function() {
    it("should render the form page correctly", function(done) {
        chai.request(app)
            .get("/")
            .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res.text).to.contain("this is from the k8s cluster--- modified line to detect the jenkins");
                done();
            });
    });

    it("should submit data successfully", function(done) {
        chai.request(app)
            .get("/submit?name=test")
            .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res.text).to.equal("data submitted successfully");
                done();
            });
    });
});
