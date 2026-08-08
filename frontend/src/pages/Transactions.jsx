import React, { useEffect, useState } from 'react';
import AppShell from '../components/AppShell.jsx';
import { api } from '../api/client.js';

export default function Transactions() {
  const [txs, setTxs] = useState([]);

  useEffect(() => {
    api.transactions().then((res) => setTxs(res.transactions)).catch(() => {});
  }, []);

  return (
    <AppShell title="Transaction History" subtitle="Every payment is recorded and verifiable on the Algorand blockchain.">
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-white/40 text-xs border-b border-white/5">
              <th className="px-4 py-3 font-normal">Project</th>
              <th className="px-4 py-3 font-normal">Payment</th>
              <th className="px-4 py-3 font-normal">Tx Hash</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal">Date</th>
            </tr>
          </thead>
          <tbody>
            {txs.map((t) => (
              <tr key={t.id} className="border-b border-white/5 last:border-0">
                <td className="px-4 py-3">{t.project}</td>
                <td className="px-4 py-3">{t.amount}</td>
                <td className="px-4 py-3 font-mono text-xs text-accent-light">
                  <a
                    href={`https://testnet.algoexplorer.io/tx/${t.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    {t.id}
                  </a>
                </td>
                <td className="px-4 py-3">
                  <span className="text-success text-xs bg-success/10 px-2 py-0.5 rounded-full">{t.status}</span>
                </td>
                <td className="px-4 py-3 text-white/50 text-xs">{t.date}</td>
              </tr>
            ))}
            {txs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-white/30 text-xs">
                  No transactions yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
