
import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon.tsx';
import { XCircleIcon } from './icons/XCircleIcon.tsx';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  imageUrl: string | null;
  onReset: () => void;
  isAnalyzing: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imageUrl, onReset, isAnalyzing }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  if (imageUrl) {
    return (
      <div className="relative group w-full max-w-md mx-auto">
        <img src={imageUrl} alt="Conversation preview" className="rounded-xl shadow-lg w-full h-auto object-contain" />
        {!isAnalyzing && (
          <button
            onClick={onReset}
            className="absolute -top-3 -right-3 bg-white rounded-full p-1 text-slate-500 hover:text-red-500 hover:scale-110 transition-all duration-200 shadow-lg"
            aria-label="Remove image"
          >
            <XCircleIcon className="w-8 h-8" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <label
        htmlFor="file-upload"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-300 ${
          isDragging ? 'border-teal-500 bg-teal-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
        }`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
          <UploadIcon className={`w-10 h-10 mb-3 transition-colors duration-300 ${isDragging ? 'text-teal-500' : 'text-slate-400'}`} />
          <p className="mb-2 text-sm text-slate-500">
            <span className="font-semibold text-teal-600">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate-500">PNG, JPG, or WEBP</p>
        </div>
        <input id="file-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
      </label>
    </div>
  );
};
