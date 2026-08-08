import React from 'react';
import Sidebar from './Sidebar.jsx';

export default function AppShell({ title, subtitle, children }) {
  return (
    <div className="flex bg-base min-h-screen">
      <Sidebar />
      <main className="flex-1 px-8 py-8 max-w-5xl">
        {title && (
          <div className="mb-8">
            <h1 className="font-display text-2xl font-semibold">{title}</h1>
            {subtitle && <p className="text-sm text-white/50 mt-1">{subtitle}</p>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
