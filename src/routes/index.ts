import express, { Request, Response, NextFunction, Router } from 'express';

const router: Router = express.Router();

/* GET home page. */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  // Assuming 'index' is a view template and 'title' is a variable for it.
  // If view engine is not set up, this will error at runtime.
  // For a pure API, might return JSON: res.json({ message: 'Welcome' });
  res.render('index', { title: 'Express' });
});

export default router;
