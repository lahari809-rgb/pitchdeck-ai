import React from 'react';
import AppShell from '../components/AppShell.jsx';

export default function Profile() {
  return (
    <AppShell title="Profile" subtitle="Your account details.">
      <div className="card p-8 max-w-md space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-white/50">Name</span>
          <span>Lahari</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50">Email</span>
          <span>demo@pitchdeck.ai</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50">Algorand Wallet</span>
          <span className="font-mono text-xs">DEMO...WALLET</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50">Member Since</span>
          <span>Aug 2024</span>
        </div>
      </div>
    </AppShell>
  );
}
