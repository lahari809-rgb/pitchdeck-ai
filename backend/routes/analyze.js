import { Router } from 'express';
import { nanoid } from 'nanoid';
import { uploads, analyses } from '../services/store.js';
import { analyzeReadme } from '../services/ai.js';

const router = Router();

router.post('/analyze', async (req, res) => {
  const { uploadId, theme } = req.body;
  const upload = uploads.get(uploadId);
  if (!upload) return res.status(404).json({ error: 'Upload not found' });

  try {
    const analysis = await analyzeReadme(upload.readmeText, upload.filename);
    const analysisId = nanoid(10);
    analyses.set(analysisId, { uploadId, theme, analysis, paid: false, txId: null });
    res.json({ analysisId, analysis });
  } catch (err) {
    res.status(500).json({ error: 'AI analysis failed: ' + err.message });
  }
});

export default router;
