export interface Deck {
  id: number;
  name: string;
  category: string | null;
}

export interface CreateDeckRequest {
  name: string;
  category: string | null;
}
