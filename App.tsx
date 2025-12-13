
import React, { useState, useRef, useEffect } from 'react';
import { generateDiagnostic } from './services/geminiService';
import { ViewerType, AntiPortfolioData, DiagnosticInputs, Attachment } from './types';
import { ViewerSelector } from './components/ViewerSelector';
import { DiagnosticReport } from './components/DiagnosticReport';
import { Search, ArrowRight, Trash2, RefreshCcw, Briefcase, AlertOctagon, Skull, ThumbsUp, ShieldBan, FileText, Upload, Paperclip, X, Sparkles, GitPullRequest, Zap, BookOpen, User } from 'lucide-react';

const DefaultInputs: DiagnosticInputs = {
  identity: '', // Populated by state
  workTraces: `Significant Decisions:
- Chose to rewrite the core billing engine in Rust instead of Python.
  > Trade-off: Development slowed down by 3 weeks initially.
  > Outcome: Zero concurrency bugs in production for 2 years. High upfront cost, low maintenance.

- Deprecated the legacy public API without full backward compatibility.
  > Trade-off: Angry partners for 1 month vs. 50% faster feature shipping for internal teams.
  > I prioritized internal velocity over external stability.`,
  friction: `Who finds me difficult?
- Product Managers who love "brainstorming" hate me. I kill ideas that aren't technically feasible within 5 minutes.
- Junior devs find me intimidating because I demand comprehensive tests before reviewing PRs.
- I tend to bypass "middle management" to get answers directly from the source.`,
  failures: `The Anti-Portfolio (My expensive mistakes):
- I over-engineered a microservices architecture for a startup that only had 500 users.
  > Cost: We burned 6 months of runway on infra instead of product market fit.
  > Lesson: Monolith first, always.

- I hired a "brilliant jerk" because I ignored the culture fit warnings.
  > Cost: Two senior engineers quit within 3 months.`,
  preferences: `My User Manual:
- I work in bursts. Don't expect me to answer Slack instantly between 9 AM and 1 PM.
- I need written specs. If it's not written down, it doesn't exist.
- I prefer brutal honesty over "sandwich feedback".`,
  nonNegotiables: `Hard Boundaries:
- I will not install monitoring software on my personal device.
- I will not work on gambling or predatory lending products.
- I refuse to attend "status update" meetings that could be an email.`,
  background: `Context:
- 7 years in Backend Engineering.
- Specialized in High-Frequency Trading systems (fintech) and then moved to HealthTech.`
};

// Rich configuration for tabs to improve UX guidance
const TAB_CONFIG: Record<keyof DiagnosticInputs, { 
    label: string; 
    icon: React.ReactNode; 
    shortDesc: string; 
    placeholder: string 
}> = {
    identity: {
        label: 'Identity',
        icon: <User size={16} />,
        shortDesc: 'Name, Role & Basics',
        placeholder: "" // Handled by custom form
    },
    workTraces: {
        label: 'Key Decisions',
        icon: <GitPullRequest size={16} />,
        shortDesc: 'Trade-offs & Hard Choices',
        placeholder: "Don't list your job duties.\n\nList the 3-5 hardest decisions you made.\n\n1. What was the problem?\n2. What did you decide?\n3. What was the TRADE-OFF? (What did you sacrifice?)\n\nExample:\n- chose stability over speed.\n- chose technical debt over missing a deadline.\n- chose to kill a feature customers loved because it wasn't profitable."
    },
    friction: {
        label: 'Friction Points',
        icon: <Zap size={16} />,
        shortDesc: 'Where do you cause tension?',
        placeholder: "Be brutally honest. Who finds it hard to work with you?\n\n- Do designers think you are too rigid?\n- Do PMs think you are too slow/fast?\n- Do you challenge authority?\n- Do you ignore processes you think are stupid?\n\n(The AI needs this to calculate your 'Systemic Cost')"
    },
    failures: {
        label: 'Anti-Portfolio',
        icon: <Skull size={16} />,
        shortDesc: 'Expensive Failures & Regrets',
        placeholder: "This is the most important section.\n\nList your specific failures.\n\n- When did you crash production?\n- When did you make a bad hire?\n- When did you build the wrong thing?\n- When did you burn out?\n\nWhat did you learn from the pain?"
    },
    preferences: {
        label: 'My Manual',
        icon: <BookOpen size={16} />,
        shortDesc: 'How to operate you',
        placeholder: "How does someone get the best ROI out of you?\n\n- Async vs Sync?\n- Verbal vs Written?\n- Solo vs Team?\n- What drains your energy?\n- What gives you energy?"
    },
    nonNegotiables: {
        label: 'Boundaries',
        icon: <ShieldBan size={16} />,
        shortDesc: 'The "No" List',
        placeholder: "What are your absolute dealbreakers?\n\n- Ethical lines?\n- Time boundaries?\n- Process requirements?\n- What will make you quit on the spot?"
    },
    background: {
        label: 'Context',
        icon: <FileText size={16} />,
        shortDesc: 'Raw Background (CV/Bio)',
        placeholder: "Paste your Bio, LinkedIn Summary, or Resume text here.\n\nThis provides the 'setting' for the diagnosis, but the other tabs provide the 'signal'."
    }
};

const TAGLINES = [
    "It matters who you are, not just what you have done.",
    "Your weaknesses are the rent you pay for your strengths.",
    "Resumes list features. We analyze the operating system.",
    "Hiring is a prediction problem, not a history lesson.",
    "Understand the systemic impact you actually create."
];

// The new "Impact Lens" logo component
const LogoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-8 h-8 rounded-[8px] shadow-glow">
        <rect width="100" height="100" rx="24" fill="#4f46e5" />
        <path d="M28 20h44a6 6 0 0 1 6 6v48a6 6 0 0 1-6 6H28a6 6 0 0 1-6-6V26a6 6 0 0 1 6-6z" fill="white" />
        <path d="M38 38h24M38 48h24M38 58h12" stroke="#e0e7ff" strokeWidth="4" strokeLinecap="round" />
        <circle cx="65" cy="65" r="14" fill="white" stroke="#4f46e5" strokeWidth="6" />
        <line x1="75" y1="75" x2="86" y2="86" stroke="white" strokeWidth="6" strokeLinecap="round" />
    </svg>
);

const App: React.FC = () => {
  const [inputs, setInputs] = useState<DiagnosticInputs>(DefaultInputs);
  // Separate state for structured identity fields
  const [identity, setIdentity] = useState({
    name: 'Alex Chen',
    role: 'Senior Staff Engineer',
    location: 'San Francisco / Remote',
    experience: '12'
  });

  const [activeTab, setActiveTab] = useState<keyof DiagnosticInputs>('identity');
  const [viewer, setViewer] = useState<ViewerType>('recruiter');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AntiPortfolioData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [taglineIndex, setTaglineIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
        setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Sync structured identity fields to the single text input required by the API
  useEffect(() => {
    const formattedIdentity = `Name: ${identity.name}\nRole: ${identity.role}\nLocation: ${identity.location}\nYears of Experience: ${identity.experience}`;
    setInputs(prev => {
        if (prev.identity === formattedIdentity) return prev;
        return { ...prev, identity: formattedIdentity };
    });
  }, [identity]);

  const handleInputChange = (field: keyof DiagnosticInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleClear = () => {
    setInputs({
      identity: '',
      workTraces: '',
      friction: '',
      failures: '',
      preferences: '',
      nonNegotiables: '',
      background: ''
    });
    setIdentity({ name: '', role: '', location: '', experience: '' });
    setAttachments([]);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        const newAttachment: Attachment = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          mimeType: file.type || 'application/octet-stream',
          data: base64String
        };
        setAttachments(prev => [...prev, newAttachment]);
      };
      
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleGenerate = async () => {
    const hasContent = Object.values(inputs).some((val) => (val as string).trim().length > 0) || attachments.length > 0;
    if (!hasContent) {
      setError("Please provide input text or upload a file.");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await generateDiagnostic(inputs, viewer, attachments);
      setData(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const activeConfig = TAB_CONFIG[activeTab];

  return (
    <div className="min-h-screen font-sans selection:bg-brand-200 selection:text-brand-900 bg-slate-50">
      
      {/* Compact Header */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-slate-200 z-40 no-print h-14 flex items-center">
        <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <LogoIcon />
                <span className="font-bold text-slate-900 tracking-tight text-lg">Impact Lens</span>
                <span className="hidden md:inline-block h-4 w-px bg-slate-200 mx-2"></span>
                <span className="hidden md:inline-block text-xs font-medium text-slate-400">Professional DNA Diagnostics</span>
            </div>
            {data && (
               <button 
                  onClick={() => setData(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition-all shadow-glow"
              >
                  <RefreshCcw size={12} /> New Analysis
              </button>
            )}
        </div>
      </nav>

      {/* Main container logic */}
      <main className={`
        container mx-auto px-4 print:pt-0 print:pb-0 
        ${!data 
            ? 'pt-32 pb-12 min-h-screen flex flex-col' // RESIZED: Increased top padding, removed fixed height constraint
            : 'pt-24 pb-20' // Report Mode: Normal Flow, Top Padding for Nav
        }
      `}>
        {!data && (
            <div className="max-w-5xl mx-auto w-full my-auto">
                
                <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 px-1 gap-4">
                   <div>
                      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
                        Reveal Your <span className="text-brand-600">Professional DNA.</span>
                      </h1>
                      <div className="h-8 mt-1 overflow-hidden relative">
                         <p key={taglineIndex} className="text-lg text-slate-500 font-medium max-w-2xl animate-fade-in-up absolute top-0 left-0">
                            {TAGLINES[taglineIndex]}
                         </p>
                      </div>
                   </div>
                   <div className="hidden md:flex gap-4 text-xs font-medium text-slate-400 pb-2">
                      <span className="flex items-center gap-1"><Sparkles size={12} className="text-brand-400"/> Identity-First</span>
                      <span className="flex items-center gap-1"><Sparkles size={12} className="text-brand-400"/> Systemic Impact</span>
                   </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row h-auto md:min-h-[480px]">
                    
                    {/* Compact Sidebar Tabs & Tools */}
                    <div className="w-full md:w-60 bg-slate-50 border-r border-slate-200 flex flex-col">
                        
                        {/* Scrollable Tabs List */}
                        <div className="flex-1 p-2 flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-1 scrollbar-hide">
                            {(Object.keys(TAB_CONFIG) as Array<keyof DiagnosticInputs>).map((tabKey) => {
                                const config = TAB_CONFIG[tabKey];
                                return (
                                    <button
                                        key={tabKey}
                                        onClick={() => setActiveTab(tabKey)}
                                        className={`
                                            flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap
                                            ${activeTab === tabKey 
                                                ? 'bg-white text-brand-600 shadow-sm ring-1 ring-slate-200' 
                                                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                                            }
                                        `}
                                    >
                                        <span className={activeTab === tabKey ? 'text-brand-500' : 'text-slate-400'}>{config.icon}</span>
                                        {config.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Global Attachments - Bottom of Sidebar */}
                        <div className="p-3 border-t border-slate-200 bg-slate-100/50">
                             <div className="text-[10px] font-bold uppercase text-slate-400 mb-2 flex items-center gap-1">
                                <Paperclip size={10} /> Global Artifacts
                             </div>
                             
                             {attachments.length > 0 && (
                                <div className="flex flex-col gap-1.5 mb-3">
                                  {attachments.map(att => (
                                    <div key={att.id} className="flex items-center justify-between bg-white border border-slate-200 text-slate-700 px-2 py-1.5 rounded shadow-sm text-xs font-medium">
                                      <span className="truncate w-32">{att.name}</span>
                                      <button onClick={() => removeAttachment(att.id)} className="hover:text-rose-500 text-slate-400"><X size={12} /></button>
                                    </div>
                                  ))}
                                </div>
                             )}

                             <input 
                                type="file" 
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                className="hidden"
                                accept=".pdf,.txt,.md,.doc,.docx,.png,.jpg,.jpeg"
                             />
                             <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full h-9 border border-dashed border-slate-300 rounded-lg flex items-center justify-center gap-2 text-slate-500 hover:border-brand-400 hover:text-brand-600 hover:bg-white transition-all text-xs font-bold"
                             >
                                <Upload size={12} /> 
                                <span>Add Your Resources</span>
                             </button>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="flex-1 p-4 md:p-6 flex flex-col relative bg-white">
                        
                        {/* Tab Info & Tools */}
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-baseline gap-2">
                                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                                    {activeConfig.label}
                                </h3>
                                <p className="text-xs text-slate-400 hidden sm:block truncate max-w-[300px] border-l border-slate-200 pl-2 ml-1">
                                    {activeConfig.shortDesc}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                  onClick={handleClear} 
                                  className="text-[10px] font-bold text-slate-400 hover:text-rose-500 flex items-center gap-1 px-2 py-1 rounded bg-slate-50 hover:bg-rose-50 transition-colors"
                                >
                                    <Trash2 size={10} /> CLEAR ALL
                                </button>
                            </div>
                        </div>
                        
                        {/* Content Container - Conditional Rendering */}
                        <div className="flex flex-col flex-1 group min-h-[140px]">
                            {activeTab === 'identity' ? (
                                <div className="flex flex-col gap-4 h-full overflow-y-auto pr-2">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Full Name</label>
                                        <input 
                                            type="text" 
                                            value={identity.name}
                                            onChange={e => setIdentity(prev => ({...prev, name: e.target.value}))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-300"
                                            placeholder="e.g. Alex Chen"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Current Role</label>
                                        <input 
                                            type="text" 
                                            value={identity.role}
                                            onChange={e => setIdentity(prev => ({...prev, role: e.target.value}))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-300"
                                            placeholder="e.g. Senior Product Manager"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Location</label>
                                        <input 
                                            type="text" 
                                            value={identity.location}
                                            onChange={e => setIdentity(prev => ({...prev, location: e.target.value}))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-300"
                                            placeholder="e.g. London / Remote"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Years of Exp.</label>
                                        <input 
                                            type="text" 
                                            value={identity.experience}
                                            onChange={e => setIdentity(prev => ({...prev, experience: e.target.value}))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-300"
                                            placeholder="e.g. 8"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <textarea 
                                    value={inputs[activeTab]}
                                    onChange={(e) => handleInputChange(activeTab, e.target.value)}
                                    className="w-full h-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-mono text-slate-700 
                                      focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all resize-none leading-relaxed placeholder-slate-400 min-h-[140px]"
                                    placeholder={activeConfig.placeholder}
                                />
                            )}
                        </div>

                        {/* Footer Controls within Card */}
                        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                            <div className="md:col-span-8">
                                <ViewerSelector selected={viewer} onChange={setViewer} />
                            </div>
                            <div className="md:col-span-4">
                                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-2 block">Action</label>
                                <button 
                                    onClick={handleGenerate}
                                    disabled={loading}
                                    className={`
                                        w-full py-3.5 rounded-xl font-bold text-sm
                                        transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5
                                        ${loading 
                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                                            : 'bg-brand-600 text-white hover:bg-brand-700'
                                        }
                                    `}
                                >
                                    {loading ? 'Analyzing...' : 'Generate Report'} <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                        {error && (
                            <div className="mt-3 bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 rounded-lg text-xs font-medium text-center">
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {data && <DiagnosticReport data={data} />}
      </main>
    </div>
  );
};

export default App;
