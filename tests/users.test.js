const chai = require ('chai');
const chaiHttp = require ('chai-http');
const app = require('../app');
const expect = chai.expect
chai.use(chaiHttp);
chai.should();


describe ("Users", () => {
    describe("GET /users", () => {
        it("should get all users", (done) => {
            chai.request(app)
                .get('/users')
                .end((err, res) => {
                    // tests
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    res.body.length.should.be.eql(5)
                    done();
                 });
        });
    });

    describe("GET /users/id", () => {
        it("should get a specific user by id", (done) => {
            const id = 1;
             chai.request(app)
                .get(`/users/${id}`)
                 .end((err, res) => {
                    //  tests
                     res.should.have.status(200);
                     res.body.should.be.an('object');
                     expect(res.body).to.have.property("id");
                     expect(res.body).to.have.property("picture");
                     expect(res.body).to.have.property("age");
                     expect(res.body).to.have.property("name");
                     expect(res.body).to.have.property("gender");
                     expect(res.body).to.have.property("company");
                     expect(res.body).to.have.property("email");
                     done();
                  });
        })
        it("should not get a single user by id", (done) => {
            const id = 100;
            chai.request(app)
                .get(`/users/${id}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                 });
        });
    });
});
