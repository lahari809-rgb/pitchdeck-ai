import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, UploadCloud, Wallet, History, User, Settings, LogOut, Boxes
} from 'lucide-react';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/upload', label: 'Generate Deck', icon: UploadCloud },
  { to: '/transactions', label: 'Transactions', icon: History },
  { to: '/wallet', label: 'Wallet', icon: Wallet },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings }
];

export default function Sidebar() {
  const navigate = useNavigate();
  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 border-r border-white/5 bg-panel flex flex-col justify-between py-6">
      <div>
        <div className="flex items-center gap-2 px-6 mb-8">
          <div className="w-8 h-8 rounded-lg bg-accent grid place-items-center">
            <Boxes size={18} />
          </div>
          <span className="font-display font-semibold text-lg">PitchDeck AI</span>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  isActive
                    ? 'bg-accent/15 text-accent-light font-medium'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="px-3">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:bg-white/5 hover:text-white w-full"
        >
          <LogOut size={17} /> Logout
        </button>
      </div>
    </aside>
  );
}
