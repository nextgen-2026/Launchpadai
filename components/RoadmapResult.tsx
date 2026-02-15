import React, { useState } from 'react';
import { RoadmapResponse } from '../types';
import { Download, Star, CheckCircle, Calendar, RefreshCw, Shield, ExternalLink, Quote, Link as LinkIcon, Book } from 'lucide-react';

declare var html2pdf: any;

interface RoadmapResultProps {
  data: RoadmapResponse;
  studentName: string;
  onReset: () => void;
}

const MarkdownView: React.FC<{ content: string }> = ({ content }) => {
  if (!content) {
    return <p className="text-slate-500 italic">No detailed content available.</p>;
  }

  const processLine = (line: string, index: number) => {
    const isList = line.trim().startsWith('- ') || line.trim().startsWith('* ');
    const cleanLine = isList ? line.trim().substring(2) : line;

    // Regex for markdown links: [text](url)
    const linkRegex = new RegExp("\\[([^\\]]+)\\]\\(([^)]+)\\)", "g");
    
    const parts = [];
    let lastIndex = 0;
    let match;

    try {
      while ((match = linkRegex.exec(cleanLine)) !== null) {
        if (match.index > lastIndex) {
          parts.push(cleanLine.substring(lastIndex, match.index));
        }
        parts.push(
          <a 
            key={match.index} 
            href={match[2]} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-neon-blue hover:text-white underline underline-offset-4 decoration-neon-blue/50 hover:decoration-white transition-all inline-flex items-center mx-1 font-medium bg-neon-blue/10 hover:bg-neon-blue/20 px-1.5 py-0.5 rounded border border-neon-blue/20"
          >
            {match[1]} <ExternalLink className="w-3 h-3 ml-1 inline" />
          </a>
        );
        lastIndex = linkRegex.lastIndex;
      }
    } catch (e) {
      console.warn("Regex error parsing line:", line);
      return <p key={index} className="text-slate-300 mb-3">{cleanLine}</p>;
    }

    if (lastIndex < cleanLine.length) {
      parts.push(cleanLine.substring(lastIndex));
    }

    const renderBold = (text: React.ReactNode): React.ReactNode => {
      if (typeof text !== 'string') return text;
      // Handle bold text **text**
      const boldParts = text.split(/\*\*(.*?)\*\*/g);
      return boldParts.map((part, i) => 
        i % 2 === 1 ? <strong key={i} className="text-white font-bold">{part}</strong> : part
      );
    };

    const finalContent = parts.length > 0 ? parts.map((p, i) => <span key={i}>{renderBold(p)}</span>) : renderBold(cleanLine);

    if (line.trim() === '') return <br key={index} />;

    if (line.startsWith('###')) {
      return <h3 key={index} className="text-lg font-bold text-neon-purple mt-6 mb-3 flex items-center"><span className="w-2 h-2 rounded-full bg-neon-purple mr-2"></span>{finalContent}</h3>;
    }
    if (line.startsWith('##')) {
      return <h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">{finalContent}</h2>;
    }
    if (line.startsWith('#')) {
      return <h1 key={index} className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple mt-8 mb-6">{finalContent}</h1>;
    }

    if (isList) {
        return (
            <div key={index} className="flex items-start mb-3 ml-2 group hover:bg-white/5 p-2 rounded-lg transition-colors">
                <span className="text-neon-blue mr-3 mt-1.5 min-w-[12px] transform group-hover:scale-125 transition-transform">▹</span>
                <span className="text-slate-300 leading-relaxed">{finalContent}</span>
            </div>
        );
    }

    return <p key={index} className="text-slate-300 mb-3 leading-relaxed">{finalContent}</p>;
  };

  return (
    <div>
      {content.split('\n').map((line, idx) => processLine(line, idx))}
    </div>
  );
};

export const RoadmapResult: React.FC<RoadmapResultProps> = ({ data, studentName, onReset }) => {
  const [rating, setRating] = useState<number>(0);
  const [rated, setRated] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    const element = document.getElementById('roadmap-content-area');
    if (!element) {
        setDownloading(false);
        return;
    }
    
    const opt = {
      margin: 0.5,
      filename: `LaunchPad_${studentName.replace(/\s+/g, '_')}_Roadmap.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#0f172a' },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    try {
      html2pdf().set(opt).from(element).save().then(() => {
          setDownloading(false);
      }).catch((err: any) => {
          console.error("PDF Export Error:", err);
          setDownloading(false);
      });
    } catch (e) {
      console.error("PDF Library Error:", e);
      setDownloading(false);
    }
  };

  const handleRate = (score: number) => {
    setRating(score);
    setRated(true);
  };

  return (
    <div className="animate-fade-in space-y-8 pb-20">
      
      {/* Header Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <div className="flex items-center space-x-2 text-neon-blue mb-1">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-bold tracking-widest uppercase">Trajectory Calculated</span>
           </div>
           <h1 className="text-3xl md:text-4xl font-bold text-white">Mission Plan for {studentName}</h1>
        </div>
        <div className="flex space-x-3">
             <button 
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center px-6 py-3 bg-white text-slate-900 rounded-lg font-bold hover:bg-neon-blue hover:text-black transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] disabled:opacity-50"
            >
                {downloading ? (
                    <span className="animate-pulse">Processing...</span>
                ) : (
                    <>
                        <Download className="w-5 h-5 mr-2" />
                        Download PDF
                    </>
                )}
            </button>
             <button 
                onClick={onReset}
                className="flex items-center px-4 py-3 glass rounded-lg text-white hover:bg-white/10 transition-colors"
            >
                <RefreshCw className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Quote Banner */}
      <div className="glass-card rounded-2xl p-8 relative overflow-hidden border-l-4 border-neon-purple shadow-[0_0_20px_rgba(176,38,255,0.15)]">
        <div className="absolute top-4 right-4 text-neon-purple opacity-20">
            <Quote className="w-16 h-16" />
        </div>
        <p className="text-2xl md:text-4xl font-bold italic text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 relative z-10 text-center leading-tight tracking-tight">
          "{data.motivationalQuote || "Action is the foundational key to all success."}"
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="roadmap-container">
        
        {/* Main Content - ID for PDF generation */}
        <div className="lg:col-span-2 space-y-8" id="roadmap-content-area">
            <div className="glass-card rounded-2xl p-8 border border-white/5 bg-[#0f172a] shadow-xl">
                <div className="mb-6 pb-4 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white flex items-center">
                        <span className="w-8 h-8 rounded-lg bg-neon-blue/20 flex items-center justify-center mr-3 text-neon-blue">1</span>
                        Flight Path
                    </h3>
                </div>
                <div className="text-slate-300">
                    <MarkdownView content={data.roadmapContent} />
                </div>
                
                {/* Reference Links Section */}
                <div className="mt-12 pt-8 border-t border-white/10">
                    <h3 className="text-xl font-bold text-white flex items-center mb-6">
                        <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center mr-3 text-emerald-400"><LinkIcon className="w-4 h-4"/></span>
                        Mission Resources
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        {data.referenceLinks && data.referenceLinks.length > 0 ? (
                            data.referenceLinks.map((link, i) => (
                                <a href={link.url} target="_blank" rel="noopener noreferrer" key={i} className="block p-4 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-400/50 hover:bg-emerald-400/5 transition-all group">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-emerald-300 group-hover:text-emerald-200 truncate pr-2">{link.title}</h4>
                                        <ExternalLink className="w-4 h-4 text-emerald-500 opacity-50 group-hover:opacity-100 flex-shrink-0" />
                                    </div>
                                    <p className="text-sm text-slate-400 mt-2 line-clamp-2">{link.description}</p>
                                </a>
                            ))
                        ) : (
                            <p className="text-slate-500 italic">No direct links available. Please verify main domain resources.</p>
                        )}
                    </div>
                </div>

                {/* Embed Schedule inside the main PDF area for better flow in PDF */}
                 <div className="mt-12 pt-8 border-t border-white/10">
                    <h3 className="text-xl font-bold text-white flex items-center mb-6">
                        <span className="w-8 h-8 rounded-lg bg-neon-pink/20 flex items-center justify-center mr-3 text-neon-pink"><Calendar className="w-4 h-4"/></span>
                        Weekly Logistics
                    </h3>
                    <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                        <MarkdownView content={data.weeklySchedule} />
                    </div>
                 </div>

                 {/* Branding footer for PDF */}
                 <div className="mt-8 pt-4 border-t border-white/5 text-center text-slate-500 text-xs hidden print:block">
                     Generated by LaunchPad AI
                 </div>
            </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
            
            {/* Security Badge */}
            <div className="glass rounded-xl p-5 border border-emerald-500/30 flex items-start space-x-4 bg-emerald-900/10">
                <Shield className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <div>
                    <h4 className="font-bold text-emerald-400 text-sm tracking-wide">SECURE ENCLAVE</h4>
                    <p className="text-xs text-emerald-200/70 mt-1">
                        Your data is processed in a volatile memory environment and is not stored on any database.
                    </p>
                </div>
            </div>

            {/* Quick Tips or Advice - Could be static or dynamic */}
            <div className="glass-card rounded-xl p-5 border border-white/5">
                <div className="flex items-center space-x-3 mb-3">
                    <Book className="w-5 h-5 text-neon-purple" />
                    <h4 className="font-bold text-white text-sm">Pro Tip</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                    Review your Weekly Logistics every Sunday night. Adjust based on your energy levels and upcoming deadlines to maintain momentum.
                </p>
            </div>

             {/* Rating */}
            <div className="glass-card rounded-2xl p-6 text-center">
                <h3 className="font-bold text-white mb-4">Rate Launch</h3>
                {rated ? (
                     <div className="py-2 px-4 bg-neon-blue/20 text-neon-blue rounded-lg font-medium animate-pulse border border-neon-blue/30">
                        Feedback Recorded
                     </div>
                ) : (
                    <div className="flex justify-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button 
                                key={star}
                                onClick={() => handleRate(star)}
                                className="text-slate-600 hover:text-yellow-400 hover:scale-125 transition-all focus:outline-none"
                            >
                                <Star className="w-8 h-8 fill-current" />
                            </button>
                        ))}
                    </div>
                )}
                <p className="text-xs text-slate-500 mt-4">Help us improve the guidance system.</p>
            </div>
        </div>
      </div>
    </div>
  );
};