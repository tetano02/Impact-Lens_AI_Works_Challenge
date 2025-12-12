import React, { useState } from 'react';
import { generateDiagnostic } from './services/geminiService';
import { ViewerType, AntiPortfolioData, DiagnosticInputs } from './types';
import { ViewerSelector } from './components/ViewerSelector';
import { DiagnosticReport } from './components/DiagnosticReport';
import { Search, ArrowRight, Trash2, RefreshCcw, Briefcase, AlertOctagon, Skull, ThumbsUp, ShieldBan, FileText } from 'lucide-react';

const DefaultInputs: DiagnosticInputs = {
  workTraces: `Projects:
- Built a CLI tool for automating deployment because I hate clicking buttons.
- Created a dashboard for tracking coffee consumption vs git commits.
- Refactored legacy codebase reducing technical debt by 40%.`,
  friction: `Conflicts:
- I often clash with "visionary" types who don't care about implementation details.
- I get frustrated when meetings are scheduled without an agenda.
- I struggled in Corporate Y because of rigid hierarchy and politics.`,
  failures: `Failures:
- Deleted production database once. Added safeguards immediately.
- Burned out trying to do everything myself in 2021. Learned delegation the hard way.`,
  preferences: `Philosophy:
- "Done is better than perfect."
- I hate meetings that could be emails.
- I prefer deleting code over writing code.`,
  nonNegotiables: `Rules:
- I will not work on weekends unless the building is on fire.
- I require autonomous decision making for my domain.`,
  background: `Experience:
- 5 years as Full Stack Dev at Startup X (Fast paced, chaos, scaled from 0 to 1M users)
- 2 years at Corporate Y (Bored, politics, built internal tools nobody used)`
};

const App: React.FC = () => {
  const [inputs, setInputs] = useState<DiagnosticInputs>(DefaultInputs);
  const [activeTab, setActiveTab] = useState<keyof DiagnosticInputs>('workTraces');
  const [viewer, setViewer] = useState<ViewerType>('recruiter');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AntiPortfolioData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof DiagnosticInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleClear = () => {
    setInputs({
      workTraces: '',
      friction: '',
      failures: '',
      preferences: '',
      nonNegotiables: '',
      background: ''
    });
  };

  const handleGenerate = async () => {
    // Basic validation: at least one field should have content
    const hasContent = Object.values(inputs).some((val) => (val as string).trim().length > 0);
    if (!hasContent) {
      setError("Please provide input in at least one section.");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await generateDiagnostic(inputs, viewer);
      setData(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const tabs: { id: keyof DiagnosticInputs; label: string; icon: React.ReactNode }[] = [
    { id: 'workTraces', label: 'Work Traces', icon: <Briefcase size={16} /> },
    { id: 'friction', label: 'Friction', icon: <AlertOctagon size={16} /> },
    { id: 'failures', label: 'Failures', icon: <Skull size={16} /> },
    { id: 'preferences', label: 'Preferences', icon: <ThumbsUp size={16} /> },
    { id: 'nonNegotiables', label: 'Boundaries', icon: <ShieldBan size={16} /> },
    { id: 'background', label: 'Background', icon: <FileText size={16} /> },
  ];

  return (
    <div className="min-h-screen font-sans selection:bg-brand-200 selection:text-brand-900">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 no-print">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="bg-brand-600 p-1.5 rounded-lg text-white">
                    <Search size={18} />
                </div>
                <span className="font-bold text-slate-900 tracking-tight text-lg">Impact Lens</span>
            </div>
            <a href="#" className="text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors">Documentation</a>
        </div>
      </nav>

      <main className="container mx-auto pt-28 px-4 pb-20 print:pt-0 print:pb-0">
        {!data && (
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12 space-y-4">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                        Reveal your <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-500">Professional DNA.</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-xl mx-auto">
                        Traditional resumes are noise. Generate a systemic diagnostic of your work style, impact, and operational trade-offs using AI.
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden p-1">
                    <div className="flex flex-col md:flex-row h-full">
                        {/* Sidebar Tabs */}
                        <div className="md:w-64 bg-slate-50 border-r border-slate-200 p-2 flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap
                                        ${activeTab === tab.id 
                                            ? 'bg-white text-brand-600 shadow-sm ring-1 ring-slate-200' 
                                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                                        }
                                    `}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="flex-1 p-6 md:p-8 flex flex-col">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                        {tabs.find(t => t.id === activeTab)?.icon}
                                        {tabs.find(t => t.id === activeTab)?.label}
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1">
                                        {activeTab === 'workTraces' && "Decisions, outcomes, artifacts, and links."}
                                        {activeTab === 'friction' && "Repeated tensions and things that never work."}
                                        {activeTab === 'failures' && "Explicit failures and painful lessons."}
                                        {activeTab === 'preferences' && "What you consistently like or avoid."}
                                        {activeTab === 'nonNegotiables' && "Rules and principles you refuse to break."}
                                        {activeTab === 'background' && "CV text, bios (treated as low-signal metadata)."}
                                    </p>
                                </div>
                                <button 
                                    onClick={handleClear} 
                                    className="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors font-medium"
                                >
                                    <Trash2 size={12} /> Clear All
                                </button>
                            </div>
                            
                            <textarea 
                                value={inputs[activeTab]}
                                onChange={(e) => handleInputChange(activeTab, e.target.value)}
                                className="w-full flex-1 min-h-[240px] bg-white border border-slate-200 rounded-xl p-4 text-sm font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none leading-relaxed placeholder-slate-300"
                                placeholder={`Enter your ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()} here...`}
                            />
                        </div>
                    </div>

                    <div className="p-6 md:p-8 border-t border-slate-100 bg-white">
                        <ViewerSelector selected={viewer} onChange={setViewer} />

                        {error && (
                            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
                                <span className="font-bold">Error:</span> {error}
                            </div>
                        )}

                        <button 
                            onClick={handleGenerate}
                            disabled={loading}
                            className={`
                                w-full py-4 rounded-xl font-bold text-base
                                transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5
                                ${loading 
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                                    : 'bg-brand-600 text-white hover:bg-brand-700'
                                }
                            `}
                        >
                            {loading ? (
                                <>Processing Systemic Analysis...</>
                            ) : (
                                <>
                                    Generate Diagnostic Report <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="p-4">
                        <div className="font-bold text-slate-900 mb-1">Anti-Fluff</div>
                        <p className="text-xs text-slate-500">No marketing buzzwords. Only falsifiable behavioral claims.</p>
                    </div>
                    <div className="p-4">
                        <div className="font-bold text-slate-900 mb-1">Systemic View</div>
                        <p className="text-xs text-slate-500">Predictive timelines and failure modes, not just success stories.</p>
                    </div>
                    <div className="p-4">
                        <div className="font-bold text-slate-900 mb-1">Lens Adaptive</div>
                        <p className="text-xs text-slate-500">Tailored insights for Founders, Recruiters, and Teams.</p>
                    </div>
                </div>
            </div>
        )}

        {data && (
            <div className="relative">
                <button 
                    onClick={() => setData(null)}
                    className="fixed bottom-8 right-8 z-50 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 text-sm font-bold hover:bg-slate-800 transition-colors no-print"
                >
                    <RefreshCcw size={16} /> New Analysis
                </button>
                <DiagnosticReport data={data} />
            </div>
        )}
      </main>
    </div>
  );
};

export default App;