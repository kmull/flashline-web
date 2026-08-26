export interface BatchCreateCardsRequest {
  // formularz nie buduje struktury karty przez UI, tylko przyjmuje gotowy JSON wklejony przez Ciebie
  // (wygenerowany przez AI). Front nie musi (i nie powinien) znać dokładnego kształtu CardContent
  cards: unknown[];
}

export interface ImportSourceTextRequest {
  title: string;
  category: string | null;
  content: string;
  level: string | null;
  cards: unknown[];
}

export interface ImportResponse {
  sourceTextId: number;
  cardsImported: number;
}
