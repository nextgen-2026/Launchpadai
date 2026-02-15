import React, { useState } from 'react';
import { StudentType, StudentData } from '../types';
import { ArrowLeft, Rocket, Target, Calendar, User } from 'lucide-react';

interface InputFormProps {
  studentType: StudentType;
  onSubmit: (data: StudentData) => void;
  onBack: () => void;
}

export const InputForm: React.FC<InputFormProps> = ({ studentType, onSubmit, onBack }) => {
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [goals, setGoals] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && year && goals) {
      onSubmit({ name, year, goals });
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <button 
        onClick={onBack}
        className="flex items-center text-slate-400 hover:text-white mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
        <span className="text-sm font-medium tracking-wide">RETURN TO SELECTION</span>
      </button>

      <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

        <h2 className="text-3xl font-bold text-white mb-2 relative z-10">
          User Profile Calibration
        </h2>
        <p className="text-slate-400 mb-8 relative z-10">Enter your coordinates to generate a precise trajectory.</p>
        
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="flex items-center text-sm font-medium text-neon-blue">
                <User className="w-4 h-4 mr-2" />
                CODENAME / FULL NAME
              </label>
              <input
                type="text"
                id="name"
                required
                className="w-full px-4 py-4 rounded-xl glass-input placeholder-slate-500 transition-all"
                placeholder="e.g. Alex Chen"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="year" className="flex items-center text-sm font-medium text-neon-purple">
                <Calendar className="w-4 h-4 mr-2" />
                {studentType === 'SCHOOL' ? 'CURRENT GRADE' : 'ACADEMIC YEAR'}
              </label>
              <input
                type="text"
                id="year"
                required
                className="w-full px-4 py-4 rounded-xl glass-input placeholder-slate-500 transition-all"
                placeholder={studentType === 'SCHOOL' ? "e.g. 10th Grade" : "e.g. Sophomore CS"}
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="goals" className="flex items-center text-sm font-medium text-neon-pink">
              <Target className="w-4 h-4 mr-2" />
              MISSION OBJECTIVES & INTERESTS
            </label>
            <textarea
              id="goals"
              required
              rows={5}
              className="w-full px-4 py-4 rounded-xl glass-input placeholder-slate-500 transition-all resize-none"
              placeholder="Describe your ultimate target. E.g., 'I want to be a Full Stack Developer at Google. I know basic JS but need a path for React and Backend.'"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full group relative overflow-hidden rounded-xl bg-white text-slate-900 font-bold py-5 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300"
          >
            <span className="relative z-10 flex items-center justify-center tracking-widest text-lg">
              <Rocket className="w-5 h-5 mr-3 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              INITIATE GENERATION
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </button>
        </form>
      </div>
    </div>
  );
};