import { Router } from 'express';
import { transactions } from '../services/store.js';

const router = Router();

router.get('/transactions', (_req, res) => {
  res.json({ transactions });
});

export default router;
