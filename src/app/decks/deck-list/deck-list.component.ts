import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { DeckService } from '../deck.service';
import { ToastrService } from 'ngx-toastr';
import { Deck } from '../deck.model';

@Component({
  selector: 'app-deck-list.component',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './deck-list.component.html',
  styleUrl: './deck-list.component.scss',
})
export class DeckListComponent {

  private readonly deckService = inject(DeckService);
  private readonly toastr = inject(ToastrService);

  decks = signal<Deck[]>([]);
  loading = signal(true);

  constructor() {
    this.loadDecks();
  }

  private loadDecks(): void {
    this.deckService.getMyDecks().subscribe({
      next: (decks) => {
        this.decks.set(decks);
        this.loading.set(false);
      },
      error: (error) => {
        this.toastr.error('Nie udało się wczytać talii');
        this.loading.set(false);
      }
    });
  }


}
