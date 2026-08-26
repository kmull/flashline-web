import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { BatchCreateCardsRequest, ImportResponse, ImportSourceTextRequest } from "./import.model";

@Injectable({ providedIn: 'root' })
export class ImportService {

  private readonly http = inject(HttpClient);

  importBatch(deckId: number, payload: BatchCreateCardsRequest): Observable<ImportResponse> {
    return this.http.post<ImportResponse>(
      `${environment.apiUrl}/decks/${deckId}/cards/batch`, payload);
  }

  importWithText(deckId: number, payload: ImportSourceTextRequest): Observable<ImportResponse> {
    return this.http.post<ImportResponse>(
      `${environment.apiUrl}/decks/${deckId}/cards/import`, payload);
  }

}
