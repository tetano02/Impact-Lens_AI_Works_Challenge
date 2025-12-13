
import React from 'react';
import { ViewerType } from '../types';
import { Eye, Users, Briefcase, UserCircle, Search } from 'lucide-react';

interface ViewerSelectorProps {
  selected: ViewerType;
  onChange: (v: ViewerType) => void;
}

const viewers: { id: ViewerType; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'founder', label: 'Founder', icon: <Briefcase size={14} />, desc: 'Focus on ROI & Speed' },
  { id: 'recruiter', label: 'Recruiter', icon: <Search size={14} />, desc: 'Focus on Red Flags' },
  { id: 'team_member', label: 'Team', icon: <Users size={14} />, desc: 'Focus on Friction' },
  { id: 'client', label: 'Client', icon: <UserCircle size={14} />, desc: 'Focus on Risk' },
  { id: 'self', label: 'Self', icon: <Eye size={14} />, desc: 'Deep Introspection' },
];

export const ViewerSelector: React.FC<ViewerSelectorProps> = ({ selected, onChange }) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col">
        <label className="text-[11px] font-bold uppercase text-slate-800 tracking-wide mb-0.5">
            Target Reader
        </label>
        <p className="text-[10px] text-slate-400 font-medium">
            Select exactly who will read this. The AI will calibrate the diagnosis to their specific goals and fears.
        </p>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {viewers.map((v) => {
          const isSelected = selected === v.id;
          return (
            <button
              key={v.id}
              onClick={() => onChange(v.id)}
              className={`
                relative flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300 group
                ${isSelected 
                  ? 'bg-brand-50 border border-brand-500 text-brand-700 shadow-sm' 
                  : 'bg-slate-50 border border-slate-200 text-slate-500 hover:bg-white hover:border-slate-300'}
              `}
              title={v.desc}
            >
              <div className={`mb-1.5 ${isSelected ? 'text-brand-600' : 'text-slate-400'}`}>{v.icon}</div>
              <div className="text-[10px] font-bold leading-none mb-1">{v.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
