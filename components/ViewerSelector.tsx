import React from 'react';
import { ViewerType } from '../types';
import { Eye, Users, Briefcase, UserCircle, Search } from 'lucide-react';

interface ViewerSelectorProps {
  selected: ViewerType;
  onChange: (v: ViewerType) => void;
}

const viewers: { id: ViewerType; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'founder', label: 'Founder', icon: <Briefcase size={18} />, desc: 'Risk & ROI' },
  { id: 'recruiter', label: 'Recruiter', icon: <Search size={18} />, desc: 'Signals' },
  { id: 'team_member', label: 'Team', icon: <Users size={18} />, desc: 'Collab' },
  { id: 'client', label: 'Client', icon: <UserCircle size={18} />, desc: 'Delivery' },
  { id: 'self', label: 'Self', icon: <Eye size={18} />, desc: 'Growth' },
];

export const ViewerSelector: React.FC<ViewerSelectorProps> = ({ selected, onChange }) => {
  return (
    <div className="flex flex-col gap-4 mb-8">
      <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Select Analytical Lens</label>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {viewers.map((v) => {
          const isSelected = selected === v.id;
          return (
            <button
              key={v.id}
              onClick={() => onChange(v.id)}
              className={`
                relative flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300
                ${isSelected 
                  ? 'bg-white border-2 border-brand-600 text-brand-700 shadow-glow transform -translate-y-1' 
                  : 'bg-slate-50 border border-slate-200 text-slate-500 hover:bg-white hover:border-slate-300 hover:shadow-sm'}
              `}
            >
              <div className={`mb-2 ${isSelected ? 'text-brand-600' : 'text-slate-400'}`}>{v.icon}</div>
              <div className="text-sm font-bold">{v.label}</div>
              <div className={`text-[10px] font-medium mt-1 ${isSelected ? 'text-brand-500' : 'text-slate-400'}`}>{v.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};