const express = require('express')
const router = express.Router()
const fs = require('fs')
const restaurants = JSON.parse(fs.readFileSync('database/restaurants.json', 'utf-8'))

// GET Restaurants
router.get('/', function (req, res) {
	res.json(restaurants)
})


module.exports = router