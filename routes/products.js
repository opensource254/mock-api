const express = require('express')
const router = express.Router()
const fs = require('fs')
const products = JSON.parse(fs.readFileSync('database/products.json', 'utf-8'))

/* GET products listing. */
router.get('/', function (req, res) {
	res.json(products)
})

/**
 * GET a product using product_id
 */
router.get('/:sku', (req, res) => {
	const productSKU = req.params.sku
 
	const productArray = products.filter((product) => {
		return product.SKU == productSKU
	})
	if (productArray.length === 0) {
		res.status(404)
		res.json('Product Not Found 😢')
	}
	res.json(productArray[0])

})

module.exports = router
