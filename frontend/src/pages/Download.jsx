import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell.jsx';
import { useDeckFlow } from '../DeckFlowContext.jsx';
import { FileDown, RefreshCw } from 'lucide-react';

export default function Download() {
  const { flow, reset } = useDeckFlow();
  const navigate = useNavigate();

 function downloadFile(kind) {
  // The backend exposes GET /api/download?analysisId=...&format=pptx|pdf
  const base = import.meta.env.VITE_API_URL || '';
  window.open(`${base}/api/download?analysisId=${flow.analysisId}&format=${kind}`, '_blank');
}

  return (
    <AppShell title="Download Your Pitch Deck" subtitle="Your investor-ready deck is generated and payment-verified on Algorand.">
      <div className="card p-8 max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-accent/15 grid place-items-center mx-auto mb-6">
          <FileDown className="text-accent-light" size={26} />
        </div>
        <div className="space-y-3">
          <button onClick={() => downloadFile('pptx')} className="btn-primary w-full py-3 text-sm">
            Download PPTX
          </button>
          <button
            onClick={() => downloadFile('pdf')}
            className="w-full py-3 text-sm rounded-lg border border-white/15 hover:bg-white/5"
          >
            Download PDF
          </button>
        </div>
        <button
          onClick={() => {
            reset();
            navigate('/upload');
          }}
          className="flex items-center gap-2 justify-center text-xs text-white/40 hover:text-white mt-8 mx-auto"
        >
          <RefreshCw size={13} /> Generate Again
        </button>
      </div>
    </AppShell>
  );
}
