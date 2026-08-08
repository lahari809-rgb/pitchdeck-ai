// Simple in-memory store for the hackathon demo.
// Replace with MySQL (as in the original architecture) for production:
// uploads, analyses, payments, and transactions would each be a table.

export const uploads = new Map();       // uploadId -> { readmeText, filename }
export const analyses = new Map();      // analysisId -> { uploadId, theme, analysis, paid, txId }
export const transactions = [];         // { id, project, amount, status, date }

export function seedTransactions() {
  if (transactions.length) return;
  transactions.push(
    { id: 'AB129C7F34DXXXX', project: 'Smart Crop Disease Detection', amount: '0.5 ALGO', status: 'Success', date: '7 Aug 2026, 10:30 AM' },
    { id: '7F09AA821EXXXXX', project: 'AI Travel Planner', amount: '0.5 ALGO', status: 'Success', date: '6 Aug 2026, 04:20 PM' },
    { id: '3C220D5A71XXXXX', project: 'Smart Waste Management', amount: '0.5 ALGO', status: 'Success', date: '5 Aug 2026, 11:15 AM' }
  );
}
seedTransactions();
