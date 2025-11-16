
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header.tsx';
import { ImageUploader } from './components/ImageUploader.tsx';
import { AnalysisDisplay } from './components/AnalysisDisplay.tsx';
import { Loader } from './components/Loader.tsx';
import { useGemini } from './hooks/useGemini.ts';
import type { AnalysisResult } from './types.ts';
import { Welcome } from './components/Welcome.tsx';

export default function App() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { analyzeConversationImage, isLoading, analysisStep } = useGemini();

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    setAnalysisResult(null);
    setError(null);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  };

  const handleAnalysis = useCallback(async () => {
    if (!imageFile) {
      setError('Please upload an image first.');
      return;
    }
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeConversationImage(imageFile);
      if (result) {
        setAnalysisResult(result);
      } else {
        setError('Could not extract or analyze the conversation. Please try a clearer image.');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
    }
  }, [imageFile, analyzeConversationImage]);

  const handleReset = () => {
    setImageFile(null);
    setImageUrl(null);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200">
            <ImageUploader
              onImageUpload={handleImageUpload}
              imageUrl={imageUrl}
              onReset={handleReset}
              isAnalyzing={isLoading}
            />

            {imageFile && !isLoading && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleAnalysis}
                  disabled={isLoading}
                  className="bg-teal-500 text-white font-bold py-3 px-8 rounded-full hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:scale-100"
                >
                  Analyze Tone
                </button>
              </div>
            )}
          </div>

          {isLoading && <Loader step={analysisStep} />}

          {error && (
            <div className="mt-8 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {analysisResult ? (
            <AnalysisDisplay result={analysisResult} />
          ) : (
            !imageFile && !isLoading && <Welcome />
          )}
        </div>
      </main>
      <footer className="text-center py-6 text-slate-500 text-sm">
        <p>Powered by Google Gemini. Designed for insightful communication.</p>
      </footer>
    </div>
  );
}
