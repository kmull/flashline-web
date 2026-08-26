import { createFeatureSelector } from "@ngrx/store";
import { ReviewSessionState } from "./review-session.reducer";

export const selectReviewSessionState =
  createFeatureSelector<ReviewSessionState>('reviewSession');
