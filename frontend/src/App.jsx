import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DeckFlowProvider } from './DeckFlowContext.jsx';

import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Upload from './pages/Upload.jsx';
import Analysis from './pages/Analysis.jsx';
import Payment from './pages/Payment.jsx';
import Preview from './pages/Preview.jsx';
import Download from './pages/Download.jsx';
import Transactions from './pages/Transactions.jsx';
import Profile from './pages/Profile.jsx';
import Wallet from './pages/Wallet.jsx';
import Settings from './pages/Settings.jsx';

export default function App() {
  return (
    <DeckFlowProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/download" element={<Download />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </DeckFlowProvider>
  );
}
