import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ReviewCard } from '../review.model';

export const ReviewSessionActions = createActionGroup({
  source: 'ReviewSession',
  events: {
    // Wczytanie kolejki kart "do powtórki dziś" dla danej talii
    'Load Due Cards': props<{ deckId: number }>(),
    'Load Due Cards Success': props<{ cards: ReviewCard[] }>(),
    'Load Due Cards Failure': props<{ error: string }>(),

    // Wysłanie oceny (quality 0-5) dla aktualnie wyświetlanej karty
    'Submit Review': props<{ deckId: number, cardId: number, quality: number }>(),
    'Submit Review Success': props<{ requeueToday: boolean }>(),
    'Submit Review Failure': props<{ error: string }>(),

    // Filtry panelu sesji
    'Set Category Filter': props<{ category: string | null }>(),
    'Toggle Mixed': emptyProps(),

    // Reset stanu przy wyjściu z sesji (np. powrót do listy talii)
    'Reset Session': emptyProps(),
  }
});
