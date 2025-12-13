
import React from 'react';
import { AntiPortfolioData } from '../types';
import { AlertTriangle, CheckCircle2, XCircle, Activity, ShieldAlert, Crosshair, ArrowRight, FileText, Search, Zap, FileJson, FileCode } from 'lucide-react';
import { downloadJSON, downloadMarkdown, downloadHTML } from '../utils/exportUtils';

interface Props {
  data: AntiPortfolioData;
}

const EvidenceTag: React.FC<{ text: string }> = ({ text }) => (
  <span className="inline-flex items-center bg-slate-100 border border-slate-200 text-slate-600 text-[10px] px-2 py-1 rounded-md mr-1.5 mb-1.5 font-medium font-mono">
    <span className="w-1 h-1 bg-slate-400 rounded-full mr-1.5"></span>
    {text}
  </span>
);

const formatText = (text: string) => {
  // Splits by ** and renders odd parts as bold
  const parts = text.split('**');
  return parts.map((part, index) => 
    index % 2 === 1 ? <strong key={index} className="font-bold text-slate-900">{part}</strong> : part
  );
};

export const DiagnosticReport: React.FC<Props> = ({ data }) => {
  
  const handleDownloadHTML = () => {
    downloadHTML(`impact-lens-report-${data.meta.viewer}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 print:space-y-8 print:pb-0">
      
      {/* Report Content */}
      <div id="diagnostic-report-content" className="bg-[#F8FAFC] print:bg-white p-4 md:p-8 rounded-3xl print:p-0">
        {/* Header / Identity Section */}
        <header className="text-center md:text-left border-b border-slate-200 pb-10 print:pb-6 break-inside-avoid">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 print:mb-4">
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide border print:border-current ${
                        data.confidence.overall === 'high' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                        data.confidence.overall === 'medium' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-rose-100 text-rose-800 border-rose-200'
                    }`}>
                        Confidence: {data.confidence.overall}
                    </span>
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-600 uppercase tracking-wide border border-slate-200">
                        Lens: {data.meta.viewer}
                    </span>
                </div>
                <div className="font-mono text-xs text-slate-400">Diagnostic ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight print:text-4xl print:mb-4">
            {data.headline}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-8 print:gap-6 print:mt-6">
                <div className="md:col-span-7 space-y-4">
                    <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest">Executive Summary</h3>
                    <ul className="space-y-3">
                        {data.diagnosis_summary.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-slate-700 leading-relaxed">
                                <ArrowRight size={18} className="mt-0.5 text-brand-600 shrink-0" />
                                <span className="font-medium">{formatText(item)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="md:col-span-5 bg-brand-50 border border-brand-100 p-6 rounded-2xl shadow-sm break-inside-avoid print:p-4">
                    <h3 className="text-xs font-bold uppercase text-brand-700 mb-4 flex items-center gap-2">
                        <Crosshair size={16} /> 
                        {data.viewer_lens_section.title}
                    </h3>
                    <ul className="space-y-3">
                        {data.viewer_lens_section.bullets.slice(0, 3).map((bullet, i) => (
                            <li key={i} className="text-sm text-slate-700 pl-4 border-l-2 border-brand-200 relative">
                                {formatText(bullet)}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </header>

        {/* Systemic Effects Timeline */}
        <section className="mt-16 print:mt-10">
            <div className="flex items-center gap-3 mb-8 print:mb-4 break-inside-avoid">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Activity size={20} /></div>
                <h2 className="text-2xl font-bold text-slate-900">Systemic Effects Timeline</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.systemic_effects_timeline.map((horizon, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft relative overflow-hidden break-inside-avoid print:p-4 print:border-slate-300">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] font-black text-6xl text-slate-900">
                            {i + 1}
                        </div>
                        <h3 className="text-sm font-bold text-brand-600 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                            {horizon.horizon.replace('_', ' ')}
                        </h3>
                        <div className="space-y-5">
                            {horizon.effects.slice(0, 2).map((effect, j) => (
                                <div key={j}>
                                    <p className="text-sm font-semibold text-slate-800 mb-2 leading-snug">{formatText(effect.claim)}</p>
                                    <div className="flex flex-wrap gap-1">
                                        {effect.evidence.slice(0, 1).map((ev, k) => <EvidenceTag key={k} text={ev} />)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Contexts Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-16 print:mt-10 print:gap-6">
                {/* Best Fit */}
                <div className="break-inside-avoid">
                    <div className="flex items-center gap-3 mb-6 print:mb-4">
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><CheckCircle2 size={20} /></div>
                        <h2 className="text-xl font-bold text-slate-900">High-Impact Environments</h2>
                    </div>
                    <div className="space-y-4">
                        {data.best_fit_contexts.map((ctx, i) => (
                            <div key={i} className="bg-white border border-emerald-100 border-l-4 border-l-emerald-400 p-5 rounded-r-xl shadow-sm hover:shadow-md transition-shadow break-inside-avoid print:p-4 print:border-emerald-200">
                                <div className="text-emerald-900 font-bold text-base mb-1">{formatText(ctx.context)}</div>
                                <p className="text-sm text-slate-600 mb-3">{formatText(ctx.why || '')}</p>
                                <div className="flex flex-wrap">{ctx.evidence.map((ev, k) => <EvidenceTag key={k} text={ev} />)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Toxic Contexts */}
                <div className="break-inside-avoid">
                    <div className="flex items-center gap-3 mb-6 print:mb-4">
                        <div className="p-2 bg-rose-100 text-rose-600 rounded-lg"><XCircle size={20} /></div>
                        <h2 className="text-xl font-bold text-slate-900">Friction Points</h2>
                    </div>
                    <div className="space-y-4">
                        {data.toxic_contexts.map((ctx, i) => (
                            <div key={i} className="bg-white border border-rose-100 border-l-4 border-l-rose-400 p-5 rounded-r-xl shadow-sm hover:shadow-md transition-shadow break-inside-avoid print:p-4 print:border-rose-200">
                                <div className="text-rose-900 font-bold text-base mb-1">{formatText(ctx.context)}</div>
                                <p className="text-sm text-slate-600 mb-3">{formatText(ctx.failure_pattern || '')}</p>
                                <div className="flex flex-wrap">{ctx.evidence.map((ev, k) => <EvidenceTag key={k} text={ev} />)}</div>
                            </div>
                        ))}
                    </div>
                </div>
        </section>

        {/* Failure Modes - STRICT LIMIT TO 2 */}
        <section className="mt-16 print:mt-10">
            <div className="flex items-center gap-3 mb-8 print:mb-4 break-inside-avoid">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><AlertTriangle size={20} /></div>
                <h2 className="text-2xl font-bold text-slate-900">Failure Mode Analysis</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.failure_modes.slice(0, 2).map((mode, i) => (
                    <div key={i} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm relative group hover:border-amber-300 transition-colors break-inside-avoid print:p-4">
                        <div className="text-amber-600 font-bold text-sm mb-4 uppercase tracking-wider flex items-center gap-2">
                            <Zap size={14} />
                            {formatText(mode.mode)}
                        </div>
                        
                        <div className="mb-4">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Trigger</span>
                            <span className="text-sm text-slate-800 font-medium">{formatText(mode.trigger)}</span>
                        </div>
                        
                        <div className="mb-4">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Symptom</span>
                            <span className="text-sm text-slate-600">{formatText(mode.symptom)}</span>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 px-6 pb-4 rounded-b-2xl print:bg-slate-50">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Mitigation</span>
                            <span className="text-sm text-emerald-600 font-medium">{formatText(mode.mitigation)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Trade-offs */}
        <section className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl break-inside-avoid mt-16 print:bg-slate-900 print:text-white print:mt-10">
            <h2 className="font-bold text-xl mb-8 flex items-center gap-3">
                <FileText size={24} className="text-brand-400" /> 
                <span>Operational Trade-offs</span>
            </h2>
            <div className="divide-y divide-slate-800">
                {data.tradeoffs.map((t, i) => (
                    <div key={i} className="py-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center first:pt-0 last:pb-0">
                        <div className="md:col-span-4 font-bold text-lg text-white">{formatText(t.tradeoff)}</div>
                        <div className="md:col-span-4 text-sm text-emerald-300">
                            <span className="uppercase text-[10px] font-bold text-slate-500 block mb-1">Upside</span>
                            {formatText(t.upside)}
                        </div>
                        <div className="md:col-span-4 text-sm text-rose-300">
                            <span className="uppercase text-[10px] font-bold text-slate-500 block mb-1">Cost</span>
                            {formatText(t.cost)}
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Don't work with me & Proof Hooks - LIMITED */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16 print:mt-10 print:gap-6">
            <div className="bg-rose-50 border border-rose-100 p-8 rounded-2xl break-inside-avoid print:p-6 print:border-rose-200">
                <div className="flex items-center gap-3 mb-6 text-rose-700">
                    <ShieldAlert size={20} />
                    <h2 className="font-bold text-lg">Incompatibility Flags</h2>
                </div>
                <ul className="space-y-3">
                    {data.dont_work_with_me_if.slice(0, 3).map((item, i) => (
                        <li key={i} className="text-slate-700 flex items-start gap-3">
                            <span className="text-rose-500 font-bold text-lg leading-none">×</span> 
                            <span className="font-medium">{formatText(item)}</span>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-soft break-inside-avoid print:p-6">
                <div className="flex items-center gap-3 mb-6 text-brand-700">
                    <Search size={20} />
                    <h2 className="font-bold text-lg">Validation Protocols</h2>
                </div>
                <div className="space-y-4">
                    {data.proof_hooks.slice(0, 2).map((hook, i) => (
                        <div key={i} className="text-sm pl-4 border-l-2 border-slate-200 py-1 hover:border-brand-500 transition-colors">
                            <div className="text-slate-900 font-bold">{formatText(hook.claim_to_validate)}</div>
                            <div className="text-xs text-slate-500 mt-1 font-mono">Verify: {formatText(hook.how_to_check)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <footer className="pt-10 border-t border-slate-200 text-center mt-16 break-inside-avoid">
            <p className="text-sm text-slate-400 font-medium">
                Impact Lens • AI Diagnostic Engine • {data.confidence.notes}
            </p>
        </footer>
      </div>

      {/* Actions (Hidden in Print) */}
      <div className="flex flex-wrap justify-center gap-4 no-print">
        <button 
            onClick={() => downloadJSON(data)}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold transition-all shadow-sm"
        >
            <FileJson size={18} /> JSON
        </button>
        <button 
            onClick={() => downloadMarkdown(data)}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold transition-all shadow-sm"
        >
            <FileText size={18} /> Markdown
        </button>
        
        {/* NEW BUTTON FOR FULL HTML REPORT */}
        <button 
            onClick={handleDownloadHTML}
            className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold transition-all shadow-glow hover:-translate-y-0.5"
        >
            <FileCode size={18} /> Download Full Report (HTML)
        </button>
      </div>
    </div>
  );
};
