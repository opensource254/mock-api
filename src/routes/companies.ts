import express, { Request, Response, Router } from 'express';
import { Company } from '../interfaces/Company'; // Adjust path if your structure differs
// Ensure that resolveJsonModule is true in tsconfig.json to directly import JSON files
import companiesData from '../database/companies.json';

const router: Router = express.Router();

// GET all companies
router.get('/', (req: Request, res: Response) => {
  // It's good practice to type cast the imported JSON if TypeScript can't infer it well
  const companies: Company[] = companiesData as Company[];
  res.json(companies);
});

// GET a company by its ID
router.get('/:id', (req: Request, res: Response) => {
  const companyId = req.params.id;
  // Type cast for safety, though find should work on an array of any type
  const company = (companiesData as Company[]).find(c => c.id === companyId);

  if (company) {
    res.json(company);
  } else {
    res.status(404).json({ message: 'Company not found' });
  }
});

export default router;
