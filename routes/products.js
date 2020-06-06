const express = require('express');
const router = express.Router();
const fs = require('fs')
const products = JSON.parse(fs.readFileSync('database/products.json', 'utf-8'))

/* GET products listing. */
router.get('/', function (req, res, _next) {
  res.json(products)
});

/**
 * GET a product using product_id
 */
router.get('/:sku', (req, res, _next) => {
  const productSKU = req.params.sku
 
  const productArray = products.filter((product, index, arr) => {
      return product.SKU == productSKU
  })
  if (productArray.length === 0) {
      res.status(404)
      res.json('Product Not Found 😢')
  }
  res.json(productArray[0])

});

module.exports = router;
