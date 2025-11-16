
export interface Emotion {
  emotion: string;
  score: number;
}

export interface MessageAnalysis {
  text: string;
  primaryTone: string;
  emotions: Emotion[];
}

export interface AnalysisResult {
  overallSentiment: string;
  sentimentScore: number;
  messages: MessageAnalysis[];
}
