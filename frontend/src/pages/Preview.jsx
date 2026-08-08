import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell.jsx';
import { useDeckFlow } from '../DeckFlowContext.jsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Preview() {
  const { flow } = useDeckFlow();
  const [idx, setIdx] = useState(0);
  const navigate = useNavigate();

  if (!flow.slides) {
    navigate('/upload');
    return null;
  }

  const slides = flow.slides;
  const slide = slides[idx];

  return (
    <AppShell title="Your Pitch Deck Is Ready 🎉" subtitle="Preview your slides below. You can download the presentation in PPTX or PDF.">
      <div className="card p-6 max-w-2xl">
        <div className="aspect-video rounded-xl bg-gradient-to-br from-accent/30 to-panel border border-white/5 flex flex-col justify-center px-10 mb-4">
          <div className="text-xs text-accent-light mb-2">Slide {idx + 1} / {slides.length}</div>
          <h2 className="font-display text-2xl font-semibold mb-2">{slide.title}</h2>
          <p className="text-sm text-white/70 max-w-md">{slide.body}</p>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            disabled={idx === 0}
            className="p-2 rounded-lg border border-white/10 disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`w-1.5 h-1.5 rounded-full ${i === idx ? 'bg-accent-light' : 'bg-white/15'}`}
              />
            ))}
          </div>
          <button
            onClick={() => setIdx((i) => Math.min(slides.length - 1, i + 1))}
            disabled={idx === slides.length - 1}
            className="p-2 rounded-lg border border-white/10 disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <button onClick={() => navigate('/download')} className="btn-primary px-6 py-3 text-sm mt-8">
        Continue to Download
      </button>
    </AppShell>
  );
}
