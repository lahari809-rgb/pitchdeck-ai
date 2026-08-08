import { Router } from 'express';
import { nanoid } from 'nanoid';
import { uploads } from '../services/store.js';

const router = Router();

router.post('/upload', (req, res) => {
  const { readmeText, filename } = req.body;
  if (!readmeText || !readmeText.trim()) {
    return res.status(400).json({ error: 'README text is required' });
  }
  const uploadId = nanoid(10);
  uploads.set(uploadId, { readmeText, filename: filename || 'README.md' });
  res.json({ uploadId });
});

export default router;
