import React from 'react';
import AppShell from '../components/AppShell.jsx';

export default function Settings() {
  return (
    <AppShell title="Settings" subtitle="Manage preferences.">
      <div className="card p-8 max-w-md text-sm text-white/50">
        Nothing to configure yet in this demo.
      </div>
    </AppShell>
  );
}
