import React from 'react';
import AppShell from '../components/AppShell.jsx';

export default function Wallet() {
  return (
    <AppShell title="Wallet" subtitle="Connect an Algorand wallet to pay for deck generation.">
      <div className="card p-8 max-w-md text-center">
        <p className="text-sm text-white/60 mb-6">
          No wallet connected. Connect Pera Wallet or Defly to pay via x402.
        </p>
        <button className="btn-primary w-full py-3 text-sm">Connect Algorand Wallet</button>
      </div>
    </AppShell>
  );
}
