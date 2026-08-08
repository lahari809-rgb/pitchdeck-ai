import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { Sparkles, ShieldCheck, Zap, FileText, Bot, Palette } from 'lucide-react';

const features = [
  { icon: FileText, label: 'Upload README', desc: 'Drop in a README.md, PDF, or paste docs directly.' },
  { icon: Bot, label: 'AI understands documentation', desc: 'Extracts problem, solution, features, and stack automatically.' },
  { icon: Palette, label: 'Beautiful PPT generation', desc: 'Investor-ready themes, generated in seconds.' },
  { icon: ShieldCheck, label: 'Blockchain-secured payments', desc: 'Every payment is verified and recorded on Algorand.' },
  { icon: Zap, label: 'x402 API access', desc: 'Pay-per-generation using the x402 payment protocol.' }
];

const steps = [
  { n: '1', label: 'Upload README' },
  { n: '2', label: 'AI reads project' },
  { n: '3', label: 'Pay through Algorand' },
  { n: '4', label: 'Download PPT' }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-base">
      <div className="absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(circle_at_30%_20%,rgba(124,92,255,0.25),transparent_60%)] pointer-events-none" />
      <Navbar />

      <section className="relative max-w-7xl mx-auto px-8 pt-16 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-medium text-accent-light bg-accent/10 border border-accent/30 rounded-full px-3 py-1 mb-6">
            <Sparkles size={13} /> AI + Blockchain · x402 Payments
          </div>
          <h1 className="font-display text-5xl leading-tight font-bold mb-6">
            Transform your README into{' '}
            <span className="text-accent-light">Investor-Ready</span> Pitch Decks
          </h1>
          <p className="text-white/60 text-lg mb-8 max-w-md">
            Upload your project documentation and get a professional pitch deck in
            minutes. Powered by AI, secured by Algorand blockchain and x402 payments.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/upload" className="btn-primary px-6 py-3 text-sm">
              Generate Deck Now
            </Link>
            <button className="px-6 py-3 rounded-lg border border-white/15 text-sm hover:bg-white/5">
              View Demo
            </button>
          </div>
          <div className="flex items-center gap-6 mt-10 text-xs text-white/40">
            <span>AI-Powered Analysis</span>
            <span>·</span>
            <span>Professional PPT Generation</span>
            <span>·</span>
            <span>Blockchain Secured</span>
            <span>·</span>
            <span>x402 Payments</span>
          </div>
        </div>

        <div className="card p-6 shadow-glow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-white/60">README.md</span>
            <span className="text-xs text-white/30">4.2 KB</span>
          </div>
          <div className="h-40 rounded-xl bg-gradient-to-br from-accent/30 to-panel border border-white/5 grid place-items-center mb-4">
            <FileText className="text-accent-light" size={40} />
          </div>
          <div className="space-y-2">
            <div className="h-2.5 bg-white/10 rounded-full w-full" />
            <div className="h-2.5 bg-white/10 rounded-full w-4/5" />
            <div className="h-2.5 bg-white/10 rounded-full w-3/5" />
          </div>
        </div>
      </section>

      <section id="features" className="max-w-7xl mx-auto px-8 py-16 border-t border-white/5">
        <h2 className="font-display text-2xl font-semibold mb-10 text-center">Features</h2>
        <div className="grid md:grid-cols-5 gap-4">
          {features.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="card p-5">
              <Icon className="text-accent-light mb-3" size={22} />
              <div className="font-medium text-sm mb-1">{label}</div>
              <div className="text-xs text-white/50">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="max-w-7xl mx-auto px-8 py-16 border-t border-white/5">
        <h2 className="font-display text-2xl font-semibold mb-10 text-center">How It Works</h2>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {steps.map((s, i) => (
            <React.Fragment key={s.n}>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/15 border border-accent/40 grid place-items-center font-display font-semibold text-accent-light">
                  {s.n}
                </div>
                <span className="text-sm text-white/70">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block flex-1 h-px bg-white/10" />
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      <footer id="about" className="border-t border-white/5 py-10 text-center text-xs text-white/30">
        Built for hackathon demo purposes · PitchDeck AI © 2026
      </footer>
    </div>
  );
}
