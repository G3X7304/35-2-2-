export interface DictionaryEntry {
  term: string;
  definition: string;
  illustrationPrompt?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface SituationalMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  illustrationUrl?: string;
  isIllustrationLoading?: boolean;
}