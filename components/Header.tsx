
import React from 'react';
import { MessageIcon } from './icons/MessageIcon.tsx';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md border-b border-slate-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="text-teal-500">
            <MessageIcon className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            AI Tone <span className="text-teal-500">Analyzer</span>
          </h1>
        </div>
      </div>
    </header>
  );
};
