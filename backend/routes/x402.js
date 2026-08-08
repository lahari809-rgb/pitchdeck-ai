import { Router } from 'express';
import { nanoid } from 'nanoid';
import { analyses, transactions } from '../services/store.js';
import { sendDemoPayment, verifyPayment } from '../services/algorand.js';

const router = Router();
const PRICE_ALGO = Number(process.env.DECK_PRICE_ALGO || 0.5);

// POST /api/x402/pay
// Initiates payment for a given analysis. In production this endpoint would
// just record intent; the actual signing happens in the user's wallet
// (Pera/Defly) in the browser. This demo signs with a funded testnet account
// so the full pay -> verify -> unlock loop is real on Algorand testnet.
router.post('/pay', async (req, res) => {
  const { analysisId } = req.body;
  const record = analyses.get(analysisId);
  if (!record) return res.status(404).json({ error: 'Analysis not found' });

  try {
    const txId = await sendDemoPayment(PRICE_ALGO);
    record.txId = txId;
    res.json({ txId, amount: `${PRICE_ALGO} ALGO`, network: process.env.ALGORAND_NETWORK || 'testnet' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

// GET /api/payment/status?txId=...
export const statusRouter = Router();
statusRouter.get('/payment/status', async (req, res) => {
  const { txId } = req.query;
  if (!txId) return res.status(400).json({ error: 'txId is required' });

  const result = await verifyPayment(txId, PRICE_ALGO);

  if (result.valid) {
    // mark the matching analysis paid + log a transaction row
    for (const record of analyses.values()) {
      if (record.txId === txId) {
        record.paid = true;
        transactions.unshift({
          id: txId,
          project: record.analysis?.title || 'Untitled Project',
          amount: `${PRICE_ALGO} ALGO`,
          status: 'Success',
          date: new Date().toLocaleString()
        });
      }
    }
  }

  res.json({ status: result.valid ? 'Success' : 'Pending', detail: result });
});
