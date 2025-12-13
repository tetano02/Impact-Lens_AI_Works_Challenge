
import React, { useState, useRef } from 'react';
import { generateDiagnostic } from './services/geminiService';
import { ViewerType, AntiPortfolioData, DiagnosticInputs, Attachment } from './types';
import { ViewerSelector } from './components/ViewerSelector';
import { DiagnosticReport } from './components/DiagnosticReport';
import { Search, ArrowRight, Trash2, RefreshCcw, Briefcase, AlertOctagon, Skull, ThumbsUp, ShieldBan, FileText, Upload, Paperclip, X, Maximize2, Minimize2, Sparkles } from 'lucide-react';

const DefaultInputs: DiagnosticInputs = {
  workTraces: `Projects:
- Built a CLI tool for automating deployment because I hate clicking buttons.
- Refactored legacy codebase reducing technical debt by 40%.`,
  friction: `Conflicts:
- I often clash with "visionary" types who don't care about implementation details.`,
  failures: `Failures:
- Deleted production database once. Added safeguards immediately.`,
  preferences: `Philosophy:
- "Done is better than perfect."`,
  nonNegotiables: `Rules:
- I will not work on weekends unless the building is on fire.`,
  background: `Experience:
- 5 years as Full Stack Dev at Startup X`
};

const App: React.FC = () => {
  const [inputs, setInputs] = useState<DiagnosticInputs>(DefaultInputs);
  const [activeTab, setActiveTab] = useState<keyof DiagnosticInputs>('workTraces');
  const [viewer, setViewer] = useState<ViewerType>('recruiter');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AntiPortfolioData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const tabs: { id: keyof DiagnosticInputs; label: string; icon: React.ReactNode }[] = [
    { id: 'workTraces', label: 'Traces', icon: <Briefcase size={16} /> },
    { id: 'friction', label: 'Friction', icon: <AlertOctagon size={16} /> },
    { id: 'failures', label: 'Failures', icon: <Skull size={16} /> },
    { id: 'preferences', label: 'Prefs', icon: <ThumbsUp size={16} /> },
    { id: 'nonNegotiables', label: 'Rules', icon: <ShieldBan size={16} /> },
    { id: 'background', label: 'Context', icon: <FileText size={16} /> },
  ];

  return (
    <div className="min-h-screen font-sans selection:bg-brand-200 selection:text-brand-900 bg-slate-50">
      
      {/* Compact Header */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-slate-200 z-40 no-print h-14 flex items-center">
        <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="bg-brand-600 p-1 rounded-md text-white shadow-glow">
                    <Search size={16} />
                </div>
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

      <main className="container mx-auto pt-20 px-4 pb-10 print:pt-0 print:pb-0 h-[calc(100vh-1rem)] flex flex-col justify-center">
        {!data && (
            <div className="max-w-5xl mx-auto w-full">
                
                <div className="flex justify-between items-end mb-4 px-1">
                   <div>
                      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        Analyze Systemic <span className="text-brand-600">Impact.</span>
                      </h1>
                   </div>
                   <div className="hidden md:flex gap-4 text-xs font-medium text-slate-400">
                      <span className="flex items-center gap-1"><Sparkles size={12} className="text-brand-400"/> Anti-Fluff</span>
                      <span className="flex items-center gap-1"><Sparkles size={12} className="text-brand-400"/> Predictive</span>
                   </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row h-auto md:min-h-[480px]">
                    
                    {/* Compact Sidebar Tabs */}
                    <div className="w-full md:w-56 bg-slate-50 border-r border-slate-200 p-2 flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-1 scrollbar-hide">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap
                                    ${activeTab === tab.id 
                                        ? 'bg-white text-brand-600 shadow-sm ring-1 ring-slate-200' 
                                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                                    }
                                `}
                            >
                                <span className={activeTab === tab.id ? 'text-brand-500' : 'text-slate-400'}>{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="flex-1 p-4 md:p-6 flex flex-col relative bg-white">
                        
                        {/* Tab Info & Tools */}
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-baseline gap-2">
                                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                                    {tabs.find(t => t.id === activeTab)?.label}
                                </h3>
                                <p className="text-xs text-slate-400 hidden sm:block truncate max-w-[200px]">
                                    {activeTab === 'workTraces' && "Decisions, outcomes, artifacts."}
                                    {activeTab === 'friction' && "Tensions and conflicts."}
                                    {activeTab === 'failures' && "Failures and lessons."}
                                    {activeTab === 'preferences' && "Likes and dislikes."}
                                    {activeTab === 'nonNegotiables' && "Hard boundaries."}
                                    {activeTab === 'background' && "CV and Bio."}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                  onClick={handleClear} 
                                  className="text-[10px] font-bold text-slate-400 hover:text-rose-500 flex items-center gap-1 px-2 py-1 rounded bg-slate-50 hover:bg-rose-50 transition-colors"
                                >
                                    <Trash2 size={10} /> CLEAR
                                </button>
                            </div>
                        </div>

                        {/* File Upload Zone */}
                        <div className="mb-3">
                           <div className="flex flex-wrap gap-2 mb-2">
                              {attachments.map(att => (
                                <div key={att.id} className="flex items-center gap-2 bg-brand-50 border border-brand-100 text-brand-700 px-3 py-1.5 rounded-md text-xs font-medium">
                                  <Paperclip size={12} />
                                  <span className="truncate max-w-[120px]">{att.name}</span>
                                  <button onClick={() => removeAttachment(att.id)} className="hover:text-rose-500"><X size={12} /></button>
                                </div>
                              ))}
                           </div>
                           <input 
                              type="file" 
                              ref={fileInputRef}
                              onChange={handleFileSelect}
                              className="hidden"
                              accept=".pdf,.txt,.md,.doc,.docx,.png,.jpg,.jpeg"
                           />
                           <button 
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full h-12 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center gap-2 text-slate-500 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50/50 transition-all text-sm font-medium"
                           >
                              <Upload size={16} /> 
                              <span>Attach PDF, Resume, or artifacts</span>
                           </button>
                        </div>
                        
                        {/* Expandable Text Area Container */}
                        <div className={`relative transition-all duration-300 flex-1 ${isExpanded ? 'fixed inset-0 z-50 bg-white p-8 flex flex-col' : 'flex flex-col'}`}>
                            {isExpanded && (
                                <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
                                   <div className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                      {tabs.find(t => t.id === activeTab)?.icon}
                                      {tabs.find(t => t.id === activeTab)?.label} Input
                                   </div>
                                   <button onClick={() => setIsExpanded(false)} className="p-2 hover:bg-slate-100 rounded-full">
                                      <Minimize2 size={20} className="text-slate-500"/>
                                   </button>
                                </div>
                            )}
                            
                            <div className="relative flex-1">
                                <textarea 
                                    value={inputs[activeTab]}
                                    onChange={(e) => handleInputChange(activeTab, e.target.value)}
                                    className={`
                                      w-full h-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-mono text-slate-700 
                                      focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all resize-none leading-relaxed placeholder-slate-300
                                      ${!isExpanded ? 'min-h-[140px]' : ''}
                                    `}
                                    placeholder={`Type or paste ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()} details here...`}
                                />
                                {!isExpanded && (
                                  <button 
                                    onClick={() => setIsExpanded(true)}
                                    className="absolute bottom-3 right-3 p-1.5 bg-white border border-slate-200 rounded-md text-slate-400 hover:text-brand-600 hover:border-brand-300 shadow-sm transition-all"
                                    title="Expand editor"
                                  >
                                    <Maximize2 size={14} />
                                  </button>
                                )}
                            </div>
                        </div>

                        {/* Footer Controls within Card */}
                        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                            <div className="md:col-span-8">
                                <ViewerSelector selected={viewer} onChange={setViewer} />
                            </div>
                            <div className="md:col-span-4">
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
