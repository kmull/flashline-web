export interface Card {
  id: number;
  deckId: number;
  type: string;
  level: string;
  question: string;
  category: string | null;
  nextReviewDate: string;
}
