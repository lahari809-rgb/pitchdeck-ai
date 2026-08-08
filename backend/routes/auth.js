import { Router } from 'express';

const router = Router();

// Demo auth — swap for real JWT/session auth (e.g. Spring Security) in production.
router.post('/login', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  res.json({ token: 'demo-jwt-token', user: { email, name: 'Lahari' } });
});

export default router;
