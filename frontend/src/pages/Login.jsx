import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Boxes } from 'lucide-react';
import { api } from '../api/client.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await api.login(email || 'demo@pitchdeck.ai', password || 'demo');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-base grid place-items-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-8 h-8 rounded-lg bg-accent grid place-items-center">
            <Boxes size={18} />
          </div>
          <span className="font-display font-semibold text-lg">PitchDeck AI</span>
        </div>
        <div className="card p-8">
          <h1 className="font-display text-xl font-semibold mb-1">Welcome back</h1>
          <p className="text-sm text-white/50 mb-6">Log in to generate your next deck.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-white/50">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full mt-1 bg-base border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-xs text-white/50">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full mt-1 bg-base border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-accent"
              />
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button type="submit" className="btn-primary w-full py-2.5 text-sm">
              Login
            </button>
          </form>
          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-white/30">OR</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <button className="w-full py-2.5 text-sm rounded-lg border border-white/15 hover:bg-white/5">
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
