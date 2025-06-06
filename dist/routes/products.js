"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const products_json_1 = __importDefault(require("../database/products.json"));
const router = express_1.default.Router();
const products = products_json_1.default;
/* GET products listing. */
router.get('/', (req, res, next) => {
    res.json(products);
});
/**
 * GET a product using product SKU
 */
router.get('/:sku', (req, res, next) => {
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
exports.default = router;
