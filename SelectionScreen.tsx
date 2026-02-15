import React from 'react';
import { School, BookOpen, ArrowRight, Star } from 'lucide-react';
import { StudentType } from '../types';

interface SelectionScreenProps {
  onSelect: (type: StudentType) => void;
}

export const SelectionScreen: React.FC<SelectionScreenProps> = ({ onSelect }) => {
  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in-up py-10">
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center px-4 py-2 rounded-full glass border border-neon-blue/30 text-neon-blue text-sm font-semibold mb-2">
            <Star className="w-4 h-4 mr-2 fill-current" /> AI-Powered Career Architecture
        </div>
        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
          Design Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink">Legacy</span>
        </h2>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
          Identify your academic stage to launch a personalized trajectory towards your ultimate goals.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 px-4">
        {/* School Card */}
        <button
          onClick={() => onSelect('SCHOOL')}
          className="group relative overflow-hidden rounded-3xl text-left transition-all duration-300 hover:-translate-y-2"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 group-hover:border-neon-blue/50 transition-colors z-0"></div>
          <div className="absolute inset-0 bg-neon-blue/5 opacity-0 group-hover:opacity-20 transition-opacity duration-500 z-0"></div>
          
          <div className="relative z-10 p-8 h-full flex flex-col">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/50 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-neon-blue/20 group-hover:border-neon-blue/50 transition-all duration-300">
              <School className="w-8 h-8 text-neon-blue" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-neon-blue transition-colors">School Student</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Foundational blueprints for K-12. Master core subjects, discover passions, and prepare for university entrance.
            </p>
            
            <div className="mt-auto flex items-center text-slate-300 text-sm font-semibold group-hover:text-neon-blue transition-colors">
              INITIALIZE PROTOCOL <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </button>

        {/* College Card */}
        <button
          onClick={() => onSelect('COLLEGE')}
          className="group relative overflow-hidden rounded-3xl text-left transition-all duration-300 hover:-translate-y-2"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 group-hover:border-neon-purple/50 transition-colors z-0"></div>
          <div className="absolute inset-0 bg-neon-purple/5 opacity-0 group-hover:opacity-20 transition-opacity duration-500 z-0"></div>
          
          <div className="relative z-10 p-8 h-full flex flex-col">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/50 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-neon-purple/20 group-hover:border-neon-purple/50 transition-all duration-300">
              <BookOpen className="w-8 h-8 text-neon-purple" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-neon-purple transition-colors">College Student</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Advanced tactical maps for Undergrads & Grads. Specialize skills, secure internships, and dominate the job market.
            </p>
            
            <div className="mt-auto flex items-center text-slate-300 text-sm font-semibold group-hover:text-neon-purple transition-colors">
              INITIALIZE PROTOCOL <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};