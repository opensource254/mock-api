/* eslint-disable no-undef */
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const expect = chai.expect
chai.use(chaiHttp)
chai.should()

var agent = chai.request.agent(app)

describe('Users', () => {
	describe('GET /users', () => {
		it('should get all users', (done) => {
			agent
				.get('/users')
				.end((err, res) => {
					// tests
					res.should.have.status(200)
					res.body.should.be.an('array')
					res.body.length.should.be.eql(100)
					done()
				})
		})
	})

	describe('GET /users/id', () => {
		it('should get a specific user by id', (done) => {
			const id = 5
			agent
				.get(`/users/${id}`)
				.end((err, res) => {
					//  tests
					res.should.have.status(200)
					res.body.should.be.an('object')
					expect(res.body).to.have.property('id')
					expect(res.body).to.have.property('first_name')
					expect(res.body).to.have.property('last_name')
					expect(res.body).to.have.property('email')
					done()
				})
		})
		it('should not get a single user by id', async () => {
			const id = 1000
			const res = await agent.get(`/users/${id}`)
			expect(res.status).equals(404)
		})
	})
})
