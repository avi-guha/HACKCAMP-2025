
import React from 'react';
import type { AnalysisResult, MessageAnalysis } from '../types.ts';
import { getEmotionColor } from '../constants.ts';
import { BarChartIcon } from './icons/BarChartIcon.tsx';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon.tsx';

const SentimentScoreBar: React.FC<{ score: number }> = ({ score }) => {
  const percentage = (score + 1) * 50;
  const bgColor = score > 0.2 ? 'bg-green-400' : score < -0.2 ? 'bg-red-400' : 'bg-yellow-400';

  return (
    <div className="w-full bg-slate-200 rounded-full h-2.5 my-2">
      <div className={`${bgColor} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

const MessageCard: React.FC<{ message: MessageAnalysis }> = ({ message }) => (
  <div className="bg-white p-4 rounded-lg border border-slate-200 mb-4 transition-shadow duration-300 hover:shadow-md">
    <p className="text-slate-700 mb-3 italic">"{message.text}"</p>
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-semibold text-sm text-slate-600">Primary Tone:</span>
      <span className={`px-2.5 py-0.5 text-sm font-medium rounded-full border ${getEmotionColor(message.primaryTone)}`}>
        {message.primaryTone}
      </span>
    </div>
    {message.emotions && message.emotions.length > 0 && (
      <div className="mt-3">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Emotion Details</h4>
        <div className="space-y-1">
          {message.emotions.map((emo, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-slate-600">{emo.emotion}</span>
              <div className="flex items-center w-1/2">
                <div className="w-full bg-slate-200 rounded-full h-1.5 mr-2">
                  <div className="bg-teal-400 h-1.5 rounded-full" style={{ width: `${emo.score * 100}%` }}></div>
                </div>
                <span className="font-mono text-xs text-slate-500">{Math.round(emo.score * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

export const AnalysisDisplay: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  return (
    <div className="mt-8 animate-fade-in">
      {/* Overall Sentiment */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 mb-8">
        <div className="flex items-center mb-4">
          <BarChartIcon className="w-6 h-6 text-teal-500 mr-3" />
          <h2 className="text-xl font-bold text-slate-800">Overall Conversation Sentiment</h2>
        </div>
        <div className="text-center md:text-left md:flex md:items-center md:justify-between">
          <div>
            <p className="text-4xl font-bold text-teal-600">{result.overallSentiment}</p>
            <p className="text-slate-500">General emotional tone of the conversation</p>
          </div>
          <div className="mt-4 md:mt-0 md:w-1/3">
            <SentimentScoreBar score={result.sentimentScore} />
            <div className="flex justify-between text-xs text-slate-500">
              <span>Negative</span>
              <span>Neutral</span>
              <span>Positive</span>
            </div>
          </div>
        </div>
      </div>

      {/* Message Breakdown */}
      <div>
        <div className="flex items-center mb-4">
          <ChatBubbleIcon className="w-6 h-6 text-teal-500 mr-3" />
          <h2 className="text-xl font-bold text-slate-800">Message Breakdown</h2>
        </div>
        <div className="space-y-4">
          {result.messages.map((msg, index) => (
            <MessageCard key={index} message={msg} />
          ))}
        </div>
      </div>
    </div>
  );
};
