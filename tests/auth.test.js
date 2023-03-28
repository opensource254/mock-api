/* eslint-disable no-undef */

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../app')
const app = chai.use(chaiHttp).request(server).keepOpen()

describe('#Stateless authentication', () => {
	it('Should return a simple token on successful authentication', async () => {
		const res = await app.post('/auth/login').send({
			username: 'admin',
			password: 'admin'
		})
		console.log(res.body)
		res.should.have.status(200)
		res.body.user.should.have.property('token')
	})

	it('Should return an error on failed authentication', async () => {
		const res = await app.post('/auth/login').send({
			username: 'admin',
			password: 'wrong'
		})
		res.should.have.status(401)
		res.body.should.have.property('message')
	})

	it('Should get the user info on successful authentication', async () => {
		const res = await app.post('/auth/login').send({
			username: 'admin',
			password: 'admin'
		})
		res.should.have.status(200)
		res.body.should.have.property('user')
		res.body.user.should.have.property('username')
		res.body.user.should.have.property('role')
		res.body.user.should.have.property('id')
		res.body.user.should.have.property('createdAt')
		res.body.user.should.have.property('updatedAt')
	})
})