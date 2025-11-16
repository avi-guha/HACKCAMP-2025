
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon.tsx';

export const Welcome: React.FC = () => {
  return (
    <div className="mt-8 text-center bg-teal-50 border-2 border-teal-200 border-dashed p-8 rounded-2xl">
      <div className="flex justify-center mb-4">
        <SparklesIcon className="w-12 h-12 text-teal-500" />
      </div>
      <h2 className="text-2xl font-bold text-teal-800 mb-2">Welcome to the Tone Analyzer</h2>
      <p className="text-slate-600 max-w-2xl mx-auto">
        Discover the underlying emotions in your text conversations. Simply upload a screenshot of a chat, and our AI will provide a detailed analysis of the tone.
      </p>
      <div className="mt-6 text-left max-w-md mx-auto space-y-2 text-slate-600">
        <p><strong>1. Upload:</strong> Click or drag-and-drop a chat screenshot.</p>
        <p><strong>2. Analyze:</strong> Hit the "Analyze Tone" button.</p>
        <p><strong>3. Discover:</strong> Get insights into the overall sentiment and a message-by-message breakdown.</p>
      </div>
    </div>
  );
};
