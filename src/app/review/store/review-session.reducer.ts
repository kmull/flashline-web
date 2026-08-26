import { createReducer, on } from "@ngrx/store";
import { ReviewCard } from "../review.model";
import { ReviewSessionActions } from './review-session-actions';

export interface ReviewSessionState {
  queue: ReviewCard[];
  currentIndex: number;
  categoryFilter: string | null;
  mixed: boolean;
  loading: boolean;
  submitting: boolean;
  error: string | null;
}

export const initialState: ReviewSessionState = {
  queue: [],
  currentIndex: 0,
  categoryFilter: null,
  mixed: true,
  loading: false,
  submitting: false,
  error: null,
};

/**
 * createReducer + on(...) — deklaratywny sposób pisania reducera:
 * dla każdej akcji podajesz FUNKCJĘ CZYSTĄ (state, action) => nowyState.
 * Reducer NIGDY nie robi HTTP, nie mutuje "state" bezpośrednio (zawsze
 * zwraca NOWY obiekt przez spread {...state, ...}) — to jest fundamentalna
 * zasada NgRx, ta sama co przy record/CardState w Javie: niemutowalność.
 */

export const reviewSessionReducer = createReducer(
  initialState,

  on(ReviewSessionActions.loadDueCards, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ReviewSessionActions.loadDueCardsSuccess, (state, { cards }) => ({
    ...state,
    queue: cards,
    currentIndex: 0,
    loading: false,
  })),

  on(ReviewSessionActions.loadDueCardsFailure, (state) => ({
    ...state,
    submitting: true,
  })),

  on(ReviewSessionActions.submitReview, (state) => ({
    ...state,
    submitting: true,
  })),

  on(ReviewSessionActions.submitReviewSuccess, (state, { requeueToday }) => {
    // Karta oceniona "dobrze" (requeueToday=false) -> usuwamy ją z kolejki.
    // Karta wymagająca powtórki dziś (requeueToday=true) -> zostaje w
    // kolejce, ale przesuwamy ją na koniec, żeby nie pokazała się
    // od razu jeszcze raz, tylko po przejściu przez resztę.

    const [current, ...rest] = state.queue;
    const newQueue = requeueToday ? [...rest, current] : rest;

    return {
      ...state,
      queue: newQueue,
      currentIndex: 0,
      submitting: false,
    }
  }),

  on(ReviewSessionActions.submitReviewFailure, (state, { error }) => ({
    ...state,
    submitting: false,
    error,
  })),

  on(ReviewSessionActions.setCategoryFilter, (state, { category }) => ({
    ...state,
    categoryFilter: category,
  })),

  on(ReviewSessionActions.toggleMixed, (state) => ({
    ...state,
    mixed: state.mixed,
  })),

  on(ReviewSessionActions.resetSession, () => initialState),

);
