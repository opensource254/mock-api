const chai = require ('chai');
const chaiHttp = require ('chai-http');
const app = require('../app');
const expect = chai.expect
chai.use(chaiHttp);
chai.should();

describe ("Products", () => {
    describe("GET /products", () => {
        it("should get all products", (done) => {
            chai.request(app)
                .get('/products')
                .end((err, res) => {
                    // tests
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.an('array');
                    res.body.length.should.be.eql(50)
                    done();
                 });
        });
    });

    describe("GET /products/productSKU", () => {
        it("should get a specific product by id", (done) => {
            const productSKU = "PRDCT44";
             chai.request(app)
                .get(`/products/${productSKU}`)
                 .end((err, res) => {
                    //  tests
                     res.should.have.status(200);
                     res.body.should.be.an('object');
                     expect(res.body).to.have.property("SKU").eql(productSKU);;
                     expect(res.body).to.have.property("title")
                     expect(res.body).to.have.property("type");
                     expect(res.body).to.have.property("description");
                     expect(res.body).to.have.property("filename");
                     expect(res.body).to.have.property("height");
                     expect(res.body).to.have.property("width");
                     expect(res.body).to.have.property("price");
                     expect(res.body).to.have.property("rating");
                     done();
                  });
        })
        it("should not get a single product by id", (done) => {
            const productSKU = "PRDCT430";
            chai.request(app)
                .get(`/products/${productSKU}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                 });
        });
    });
});
