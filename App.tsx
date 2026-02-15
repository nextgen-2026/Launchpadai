import React, { useState } from 'react';
import { Header } from './components/Header';
import { SelectionScreen } from './components/SelectionScreen';
import { InputForm } from './components/InputForm';
import { RoadmapResult } from './components/RoadmapResult';
import { StudentData, RoadmapResponse, StudentType } from './types';
import { generateRoadmap } from './services/geminiService';
import { AlertCircle, Sparkles } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState<number>(1);
  const [studentType, setStudentType] = useState<StudentType | null>(null);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTypeSelect = (type: StudentType) => {
    setStudentType(type);
    setStep(2);
  };

  const handleFormSubmit = async (data: StudentData) => {
    setStudentData(data);
    setLoading(true);
    setError(null);
    try {
      if (!studentType) throw new Error("Student type not selected");
      const result = await generateRoadmap(studentType, data);
      setRoadmap(result);
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Failed to generate roadmap. Please check your API Key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setStudentType(null);
    setStudentData(null);
    setRoadmap(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden text-slate-100">
      {/* Dynamic Background */}
      <div className="fixed inset-0 w-full h-full -z-10 bg-[#020617]">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      <Header onReset={handleReset} />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-8 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-neon-purple rounded-full blur-2xl opacity-40 animate-pulse"></div>
              <div className="w-24 h-24 rounded-full border-t-4 border-l-4 border-neon-blue border-solid animate-spin relative z-10 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.5)]">
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
                Igniting Engines...
              </h2>
              <p className="text-slate-400 text-lg">Calculating trajectory and compiling resources.</p>
            </div>
          </div>
        ) : (
          <div className="transition-all duration-700 ease-in-out">
            {error && (
               <div className="glass-card border-l-4 border-red-500 p-6 mb-8 rounded-r-lg flex items-start">
                 <AlertCircle className="w-6 h-6 text-red-500 mr-4 mt-1 flex-shrink-0" />
                 <div>
                   <h3 className="text-red-400 font-bold text-lg">Launch Aborted</h3>
                   <p className="text-slate-300 mt-1">{error}</p>
                 </div>
               </div>
            )}

            {step === 1 && <SelectionScreen onSelect={handleTypeSelect} />}
            
            {step === 2 && studentType && (
              <InputForm 
                studentType={studentType} 
                onSubmit={handleFormSubmit} 
                onBack={() => setStep(1)} 
              />
            )}
            
            {step === 3 && roadmap && studentData && (
              <RoadmapResult 
                data={roadmap} 
                studentName={studentData.name} 
                onReset={handleReset}
              />
            )}
          </div>
        )}
      </main>

      <footer className="glass border-t border-slate-800 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p className="font-medium text-slate-400">© {new Date().getFullYear()} LaunchPad AI. Accelerate Your Potential.</p>
          <p className="mt-2 text-xs opacity-60">
            Secure Session | Data Processed in Real-Time | No Persistent Storage
          </p>
        </div>
      </footer>
    </div>
  );
}