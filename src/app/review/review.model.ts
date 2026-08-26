export interface Gap {
  id: number;
  acceptedAnswers: string[];
  options: string[];
  hint: string | null;
}

export interface GapBasedContent {
  type: 'GAP_BASED';
  fullText: string;
  gapText: string | null;
  acceptedFullAnswers: string[];
  gaps: Gap[];
}

export type CardContent = GapBasedContent;

export interface ReviewCard {
  id: number;
  deckId: number;
  type: string;
  suggestedMode: string | null;
  category: string | null;
  question: string;
  content: CardContent;
  audioUrl: string | null;
  extendedInfo: string | null;
  level: string | null;
  nextReviewDate: string;
}

export interface ReviewRequest {
  quality: number;
}

export interface ReviewResponse {
  nextReviewDate: string;
  intervalDays: number;
  requeueToday: boolean;
}
