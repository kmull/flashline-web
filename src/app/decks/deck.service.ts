import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateDeckRequest, Deck } from './deck.model';

@Injectable({
  providedIn: 'root',
})
export class DeckService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/decks`;

  getMyDecks(): Observable<Deck[]> {
    return this.http.get<Deck[]>(this.apiUrl);
  }

  createDeck(request: CreateDeckRequest): Observable<Deck> {
    return this.http.post<Deck>(this.apiUrl, request);
  }

  getDeck(id: number): Observable<Deck> {
    return this.http.get<Deck>(`${this.apiUrl}/${id}`);
  }

}
