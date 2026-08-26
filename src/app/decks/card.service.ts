import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Card } from './card.model';

@Injectable({
  providedIn: 'root',
})
export class CardService {

  private readonly http = inject(HttpClient);

  getCards(deckId: number): Observable<Card[]> {
    return this.http.get<Card[]>(`${environment.apiUrl}/decks/${deckId}/cards`);
  }

}
