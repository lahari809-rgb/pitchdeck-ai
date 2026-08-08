import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell.jsx';
import { useDeckFlow } from '../DeckFlowContext.jsx';
import { api } from '../api/client.js';
import { Check } from 'lucide-react';

const checkpoints = [
  'Reading README.md',
  'Extracting project title',
  'Identifying problem statement',
  'Analyzing solution',
  'Extracting key features',
  'Detecting tech stack',
  'Generating slide structure'
];

export default function Analysis() {
  const [doneCount, setDoneCount] = useState(0);
  const [error, setError] = useState('');
  const { flow, update } = useDeckFlow();
  const navigate = useNavigate();

  useEffect(() => {
    if (!flow.uploadId) {
      navigate('/upload');
      return;
    }

    const tick = setInterval(() => {
      setDoneCount((c) => (c < checkpoints.length ? c + 1 : c));
    }, 450);

    api
      .analyze(flow.uploadId, flow.theme)
      .then((res) => {
        update({ analysisId: res.analysisId, analysis: res.analysis });
      })
      .catch((err) => setError(err.message));

    return () => clearInterval(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (doneCount === checkpoints.length && flow.analysisId) {
      const t = setTimeout(() => navigate('/payment'), 500);
      return () => clearTimeout(t);
    }
  }, [doneCount, flow.analysisId, navigate]);

  const progress = Math.round((doneCount / checkpoints.length) * 100);

  return (
    <AppShell title="AI Is Analyzing Your Project" subtitle="Our AI is reading your documentation and extracting key information.">
      <div className="card p-8 max-w-xl">
        <div className="space-y-4 mb-8">
          {checkpoints.map((c, i) => (
            <div key={c} className="flex items-center gap-3 text-sm">
              <div
                className={`w-5 h-5 rounded-full grid place-items-center shrink-0 ${
                  i < doneCount ? 'bg-success/20 text-success' : 'bg-white/5 text-white/20'
                }`}
              >
                {i < doneCount ? <Check size={12} /> : <span className="w-1.5 h-1.5 rounded-full bg-white/20" />}
              </div>
              <span className={i < doneCount ? 'text-white' : 'text-white/40'}>{c}</span>
            </div>
          ))}
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-accent to-accent-light transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <div className="text-xs text-white/40 mt-2">
          {progress < 100 ? `Almost done… ${progress}%` : 'Analysis complete'}
        </div>
        {error && <p className="text-xs text-red-400 mt-4">{error}</p>}
      </div>
    </AppShell>
  );
}
