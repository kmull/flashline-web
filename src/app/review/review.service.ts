import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ReviewCard, ReviewRequest, ReviewResponse } from './review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/decks`;

  getDueCards(deckId: number): Observable<ReviewCard[]> {
    return this.http.get<ReviewCard[]>(`${this.apiUrl}/${deckId}/cards/due`);
  }

  submitReview(deckId: number, cardId: number, request: ReviewRequest): Observable<ReviewResponse> {
    return this.http.post<ReviewResponse>(
      `${this.apiUrl}/${deckId}/cards/${cardId}/review`, request);
  }

}
