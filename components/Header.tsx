import React from 'react';
import { Rocket, Zap, Radio } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="glass sticky top-0 z-50 border-b border-white/10 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div 
          onClick={onReset}
          className="flex items-center space-x-3 cursor-pointer group select-none"
        >
          <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-300 transform group-hover:-translate-y-1">
            <Rocket className="w-5 h-5 text-white absolute group-hover:animate-pulse" />
            <div className="absolute -bottom-1 w-full h-1 bg-neon-blue blur-[4px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Launch<span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Pad</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Student Career Architect</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <button onClick={onReset} className="text-slate-300 hover:text-white hover:scale-105 transition-all text-sm font-medium">
            New Trajectory
          </button>
          <div className="flex items-center px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Radio className="w-3 h-3 mr-2 animate-pulse" />
            Systems Online
          </div>
        </nav>
      </div>
    </header>
  );
};