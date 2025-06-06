import express, { Request, Response, NextFunction, Router } from 'express';
import { Product } from '../interfaces/Product';
import productsData from '../database/products.json';

const router: Router = express.Router();

const products: Product[] = productsData;

/* GET products listing. */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json(products);
});

/**
 * GET a product using product SKU
 */
router.get('/:sku', (req: Request, res: Response, next: NextFunction) => {
  const productSKU = req.params.sku;

  // Find the product by SKU.
  // Note: The original code used filter which returns an array.
  // `find` is more appropriate for finding a single item.
  const product = products.find(p => p.SKU === productSKU);

  if (!product) {
    res.status(404).json({ message: 'Product Not Found 😢' }); // Send JSON response
    return; // Ensure no further code is executed for this request
  }
  res.json(product);
});

export default router;
