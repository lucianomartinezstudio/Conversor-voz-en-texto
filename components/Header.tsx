import React from 'react';
import { FileAudio } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-100 py-3 px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-sm">
          <FileAudio size={20} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-none">Dictado AI</h1>
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide mt-1">Powered by Gemini 2.5</p>
        </div>
      </div>
    </header>
  );
};
