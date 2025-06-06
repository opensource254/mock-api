"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// Ensure that resolveJsonModule is true in tsconfig.json to directly import JSON files
const companies_json_1 = __importDefault(require("../database/companies.json"));
const router = express_1.default.Router();
// GET all companies
router.get('/', (req, res) => {
    // It's good practice to type cast the imported JSON if TypeScript can't infer it well
    const companies = companies_json_1.default;
    res.json(companies);
});
// GET a company by its ID
router.get('/:id', (req, res) => {
    const companyId = req.params.id;
    // Type cast for safety, though find should work on an array of any type
    const company = companies_json_1.default.find(c => c.id === companyId);
    if (company) {
        res.json(company);
    }
    else {
        res.status(404).json({ message: 'Company not found' });
    }
});
exports.default = router;
