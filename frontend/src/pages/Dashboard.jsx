import React from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../components/AppShell.jsx';
import { Plus } from 'lucide-react';

const stats = [
  { label: 'Total Decks Created', value: '12' },
  { label: 'Total Spent', value: '6.0 ALGO' },
  { label: 'Successful Payments', value: '12' },
  { label: 'Member Since', value: 'Aug 2024' }
];

const recentDecks = [
  { name: 'Smart Crop Disease Detection', theme: 'Startup', date: '7 Aug 2026' },
  { name: 'AI Travel Planner', theme: 'Startup', date: '6 Aug 2026' },
  { name: 'Smart Waste Management', theme: 'Academic', date: '5 Aug 2026' },
  { name: 'College Event Management System', theme: 'Academic', date: '3 Aug 2026' }
];

const recentTx = [
  { id: '0xAB129C…F34D', project: 'Smart Crop Disease Detection', amount: '0.5 ALGO', status: 'Success', date: '7 Aug 2026, 10:30 AM' },
  { id: '0x7F09AA…821E', project: 'AI Travel Planner', amount: '0.5 ALGO', status: 'Success', date: '6 Aug 2026, 04:20 PM' },
  { id: '0x3C220D…5A71', project: 'Smart Waste Management', amount: '0.5 ALGO', status: 'Success', date: '5 Aug 2026, 11:15 AM' }
];

export default function Dashboard() {
  return (
    <AppShell title="Dashboard" subtitle="Welcome back, Lahari 👋">
      <div className="flex justify-end -mt-16 mb-6">
        <Link to="/upload" className="btn-primary flex items-center gap-2 px-4 py-2.5 text-sm">
          <Plus size={16} /> Generate New Deck
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <div className="text-xs text-white/50 mb-2">{s.label}</div>
            <div className="font-display text-2xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium">Recent Decks</h2>
        <Link to="/transactions" className="text-xs text-accent-light">View all</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {recentDecks.map((d) => (
          <div key={d.name} className="card overflow-hidden">
            <div className="h-24 bg-gradient-to-br from-accent/30 to-panel" />
            <div className="p-3">
              <div className="text-sm font-medium truncate">{d.name}</div>
              <div className="text-[11px] text-white/40 mt-1">{d.theme} · {d.date}</div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="font-medium mb-4">Recent Transactions</h2>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-white/40 text-xs border-b border-white/5">
              <th className="px-4 py-3 font-normal">Transaction ID</th>
              <th className="px-4 py-3 font-normal">Project</th>
              <th className="px-4 py-3 font-normal">Amount</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentTx.map((t) => (
              <tr key={t.id} className="border-b border-white/5 last:border-0">
                <td className="px-4 py-3 font-mono text-xs text-white/70">{t.id}</td>
                <td className="px-4 py-3">{t.project}</td>
                <td className="px-4 py-3">{t.amount}</td>
                <td className="px-4 py-3">
                  <span className="text-success text-xs bg-success/10 px-2 py-0.5 rounded-full">{t.status}</span>
                </td>
                <td className="px-4 py-3 text-white/50 text-xs">{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
