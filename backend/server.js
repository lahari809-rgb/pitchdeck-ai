import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import uploadRoutes from './routes/upload.js';
import analyzeRoutes from './routes/analyze.js';
import generateRoutes from './routes/generate.js';
import x402Routes, { statusRouter } from './routes/x402.js';
import transactionsRoutes from './routes/transactions.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.use('/api', authRoutes);
app.use('/api', uploadRoutes);
app.use('/api', analyzeRoutes);
app.use('/api', generateRoutes);
app.use('/api/x402', x402Routes);
app.use('/api', statusRouter);
app.use('/api', transactionsRoutes);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`PitchDeck AI backend running on http://localhost:${PORT}`);
});
