
import { useState, useCallback } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import type { AnalysisResult } from '../types.ts';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY, vertexai: true });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    overallSentiment: {
      type: Type.STRING,
      description: 'A single word describing the overall sentiment (e.g., Joyful, Tense, Neutral, Mixed).',
    },
    sentimentScore: {
      type: Type.NUMBER,
      description: 'A score from -1 (very negative) to 1 (very positive) for the overall conversation.',
    },
    messages: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING, description: 'The exact text of the message.' },
          primaryTone: {
            type: Type.STRING,
            description: 'The dominant emotional tone of this specific message from the list: Joy, Sadness, Anger, Surprise, Fear, Love, Optimism, Pessimism, Neutral.',
          },
          emotions: {
            type: Type.ARRAY,
            description: 'A list of up to 3 detected emotions with scores.',
            items: {
              type: Type.OBJECT,
              properties: {
                emotion: { type: Type.STRING, description: 'The detected emotion (e.g., Joy, Sadness, Anger).' },
                score: { type: Type.NUMBER, description: 'Confidence score from 0 to 1.' },
              },
              required: ['emotion', 'score'],
            },
          },
        },
        required: ['text', 'primaryTone', 'emotions'],
      },
    },
  },
  required: ['overallSentiment', 'sentimentScore', 'messages'],
};

export const useGemini = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<'extracting' | 'analyzing' | null>(null);

  const analyzeConversationImage = useCallback(async (file: File): Promise<AnalysisResult | null> => {
    setIsLoading(true);
    try {
      // Step 1: Extract text from the image
      setAnalysisStep('extracting');
      const imagePart = await fileToGenerativePart(file);
      const textExtractionResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          role: 'user',
          parts: [
            imagePart,
            { text: 'Extract all text from this image of a conversation. Present it as a clean, readable transcript. Maintain the conversational flow and separate messages clearly with newlines.' },
          ],
        },
      });

      const extractedText = textExtractionResponse.text;
      if (!extractedText || extractedText.trim().length < 10) {
        console.warn('Text extraction failed or produced minimal text.');
        return null;
      }

      // Step 2: Analyze the extracted text
      setAnalysisStep('analyzing');
      const analysisPrompt = `Analyze the tone of the following conversation transcript. For each message, identify the primary tone and a breakdown of detected emotions with confidence scores. Also, provide an overall sentiment and a sentiment score for the entire conversation. The list of possible primary tones is: Joy, Sadness, Anger, Surprise, Fear, Love, Optimism, Pessimism, Neutral. The conversation is:\n\n${extractedText}`;
      
      const analysisResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { role: 'user', parts: [{ text: analysisPrompt }] },
        config: {
          responseMimeType: 'application/json',
          responseSchema: analysisSchema,
        },
      });

      const resultJson = analysisResponse.text;
      const result = JSON.parse(resultJson) as AnalysisResult;
      return result;

    } catch (error) {
      console.error('Gemini API Error:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to analyze image. Reason: ${error.message}`);
      }
      throw new Error('An unknown error occurred while communicating with the AI.');
    } finally {
      setIsLoading(false);
      setAnalysisStep(null);
    }
  }, []);

  return { analyzeConversationImage, isLoading, analysisStep };
};
