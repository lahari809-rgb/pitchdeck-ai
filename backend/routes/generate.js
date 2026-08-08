import { Router } from 'express';
import path from 'path';
import { analyses } from '../services/store.js';
import { buildSlideDeckModel, renderPptx } from '../services/ppt.js';

const router = Router();
const PRICE_ALGO = Number(process.env.DECK_PRICE_ALGO || 0.5);

// POST /api/generate
// This is the x402-protected resource. If the analysis hasn't been paid for,
// respond with the standard x402 "402 Payment Required" status and a JSON
// body describing exactly how to pay (amount, asset, network, recipient).
// Once record.paid is true (set by /api/payment/status after verifying the
// transaction on Algorand), this endpoint actually builds the deck.
router.post('/generate', async (req, res) => {
  const { analysisId } = req.body;
  const record = analyses.get(analysisId);
  if (!record) return res.status(404).json({ error: 'Analysis not found' });

  if (!record.paid) {
    return res.status(402).json({
      error: 'Payment required',
      price: {
        amount: String(PRICE_ALGO),
        asset: 'ALGO',
        network: process.env.ALGORAND_NETWORK === 'mainnet' ? 'Algorand MainNet' : 'Algorand TestNet'
      },
      payTo: process.env.MERCHANT_WALLET_ADDRESS || null,
      protocol: 'x402'
    });
  }

  const slides = buildSlideDeckModel(record.analysis);
  record.slides = slides;
  res.json({ slides });
});

// GET /api/download?analysisId=...&format=pptx|pdf
router.get('/download', async (req, res) => {
  const { analysisId, format } = req.query;
  const record = analyses.get(analysisId);
  if (!record) return res.status(404).json({ error: 'Analysis not found' });
  if (!record.paid) return res.status(402).json({ error: 'Payment required before download' });

  try {
    const filePath = await renderPptx(record.analysis, record.theme, '/tmp/pitchdeck-ai');
    if (format === 'pdf') {
      // Converting pptx -> pdf reliably needs a native tool (e.g. LibreOffice
      // headless: `soffice --headless --convert-to pdf`). Wire that up here
      // in production; for this demo we return the pptx either way.
      return res.download(filePath, 'pitch-deck.pptx');
    }
    res.download(filePath, path.basename(filePath));
  } catch (err) {
    res.status(500).json({ error: 'Failed to render deck: ' + err.message });
  }
});

export default router;
