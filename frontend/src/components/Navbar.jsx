import React from 'react';
import { Link } from 'react-router-dom';
import { Boxes } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-accent grid place-items-center">
          <Boxes size={18} />
        </div>
        <span className="font-display font-semibold text-lg">PitchDeck AI</span>
      </Link>
      <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
        <a href="#features" className="hover:text-white">Features</a>
        <a href="#how" className="hover:text-white">How it Works</a>
        <a href="#pricing" className="hover:text-white">Pricing</a>
        <a href="#about" className="hover:text-white">About</a>
      </nav>
      <Link
        to="/login"
        className="px-4 py-2 rounded-lg border border-white/15 text-sm hover:bg-white/5"
      >
        Login
      </Link>
    </header>
  );
}
