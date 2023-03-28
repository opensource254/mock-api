const express = require('express')
const router = express.Router()
const { faker } = require('@faker-js/faker')


/* GET users listing. */
router.get('/', function (req, res, next) {
	try {
	
		const users = []
		for (let id = 1; id <= 100; id++) {
			let firstName = faker.name.firstName()
			let lastName = faker.name.lastName()
			let email = faker.internet.email()
			let gender = faker.name.gender()
			let career = faker.name.jobTitle()

			users.push({
				id: id,
				first_name: firstName,
				last_name: lastName,
				email: email,
				gender: gender,
				career: career,
			})
		}

		req.session.users = users
		res.json(users)
		
	} catch (error) {
		next(error)
	}
})

router.get('/:user', (req, res, next) => {
	try {
		const users = req.session.users
		const user = users.find(u => u.id == req.params.user)

		if (user) {
			return res.json(user)
		}
		res.status(404).json({message: 'Not found'})
	} catch (error) {
		next(error)
	}
})

module.exports = router
