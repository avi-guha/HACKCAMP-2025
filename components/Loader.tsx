
import React from 'react';

interface LoaderProps {
  step: 'extracting' | 'analyzing' | null;
}

const messages = {
  extracting: 'Extracting text from image...',
  analyzing: 'Analyzing conversation tone...',
  default: 'Processing your request...',
};

export const Loader: React.FC<LoaderProps> = ({ step }) => {
  const message = step ? messages[step] : messages.default;

  return (
    <div className="mt-8 flex flex-col items-center justify-center text-center p-4" aria-live="polite">
      <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-semibold text-teal-700">{message}</p>
      <p className="text-sm text-slate-500">This may take a moment. Thank you for your patience.</p>
    </div>
  );
};
