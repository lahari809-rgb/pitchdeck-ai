import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell.jsx';
import { useDeckFlow } from '../DeckFlowContext.jsx';
import { api } from '../api/client.js';
import { UploadCloud, FileText } from 'lucide-react';

const themes = ['Startup', 'Academic', 'Corporate'];

export default function Upload() {
  const [file, setFile] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [theme, setTheme] = useState('Startup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { update } = useDeckFlow();
  const navigate = useNavigate();

  function onFileChange(e) {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  }

  async function handleContinue() {
    setError('');
    if (!file && !pastedText.trim()) {
      setError('Upload a README/PDF or paste your documentation first.');
      return;
    }
    setLoading(true);
    try {
      const text = file ? await file.text().catch(() => pastedText) : pastedText;
      const res = await api.upload(text, file?.name || 'pasted-doc.md');
      update({ uploadId: res.uploadId, filename: file?.name || 'Pasted documentation', theme });
      navigate('/analysis');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell title="Upload Your Project Documentation" subtitle="Upload README.md, PDF, or paste your documentation to get started.">
      <div className="card p-8 max-w-2xl">
        <label
          htmlFor="file-input"
          className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-white/10 rounded-xl py-12 cursor-pointer hover:border-accent/50 transition"
        >
          {file ? <FileText className="text-accent-light" size={28} /> : <UploadCloud className="text-white/40" size={28} />}
          <div className="text-sm text-white/70">
            {file ? file.name : 'Drag & drop your file here'}
          </div>
          {!file && <div className="text-xs text-accent-light">or click to browse</div>}
          <div className="text-[11px] text-white/30">Supports: .md, .pdf, .docx, .txt (Max 10MB)</div>
          <input id="file-input" type="file" accept=".md,.pdf,.docx,.txt" className="hidden" onChange={onFileChange} />
        </label>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-white/30">OR</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <textarea
          value={pastedText}
          onChange={(e) => setPastedText(e.target.value)}
          placeholder="Paste your README or project documentation here…"
          rows={5}
          className="w-full bg-base border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-accent resize-none"
        />

        <div className="mt-8">
          <div className="text-xs text-white/50 mb-3">Theme</div>
          <div className="flex gap-3">
            {themes.map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-4 py-2 rounded-lg text-sm border transition ${
                  theme === t
                    ? 'border-accent bg-accent/10 text-accent-light'
                    : 'border-white/10 text-white/60 hover:bg-white/5'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-xs text-red-400 mt-4">{error}</p>}

        <button
          onClick={handleContinue}
          disabled={loading}
          className="btn-primary w-full py-3 text-sm mt-8 disabled:opacity-50"
        >
          {loading ? 'Uploading…' : 'Generate Deck'}
        </button>
      </div>
    </AppShell>
  );
}
