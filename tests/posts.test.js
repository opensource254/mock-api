/* eslint-disable no-undef */
const chai = require ('chai')
const chaiHttp = require ('chai-http')
const app = require('../app')
const expect = chai.expect
chai.use(chaiHttp)
chai.should()

describe ('Posts', () => {
	describe('GET /posts', () => {
		it('should get all posts', (done) => {
			chai.request(app)
				.get('/posts')
				.end((err, res) => {
					// tests
					res.should.have.status(200)
					res.should.be.json
					res.body.should.be.an('array')
					res.body.length.should.be.eql(100)
					done()
				})
		})
	})

	describe('GET /posts/id', () => {
		it('should get a specific post by id', (done) => {
			const id = 1
			chai.request(app)
				.get(`/posts/${id}`)
				.end((err, res) => {
					//  tests
					res.should.have.status(200)
					res.body.should.be.an('object')
					expect(res.body).to.have.property('id').eql(id)
					expect(res.body).to.have.property('user_id')
					expect(res.body).to.have.property('title')
					expect(res.body).to.have.property('body')
					done()
				})
		})
		it('should not get a single post by id', (done) => {
			const id = 300
			chai.request(app)
				.get(`/posts/${id}`)
				.end((err, res) => {
					res.should.have.status(404)
					done()
				})
		})
	})
})
