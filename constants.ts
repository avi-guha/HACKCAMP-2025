
export const EMOTION_COLORS: { [key: string]: string } = {
  Joy: 'bg-yellow-200 text-yellow-800 border-yellow-300',
  Sadness: 'bg-blue-200 text-blue-800 border-blue-300',
  Anger: 'bg-red-200 text-red-800 border-red-300',
  Surprise: 'bg-purple-200 text-purple-800 border-purple-300',
  Fear: 'bg-gray-300 text-gray-800 border-gray-400',
  Neutral: 'bg-slate-200 text-slate-800 border-slate-300',
  Love: 'bg-pink-200 text-pink-800 border-pink-300',
  Optimism: 'bg-green-200 text-green-800 border-green-300',
  Pessimism: 'bg-indigo-200 text-indigo-800 border-indigo-300',
  default: 'bg-slate-200 text-slate-800 border-slate-300',
};

export const getEmotionColor = (emotion: string): string => {
  return EMOTION_COLORS[emotion] || EMOTION_COLORS.default;
};
