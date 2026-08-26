import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Card } from '../card.model';
import { CardService } from '../card.service';
import { Deck } from '../deck.model';
import { DeckService } from '../deck.service';

@Component({
  selector: 'app-deck-detail.component',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './deck-detail.component.html',
  styleUrl: './deck-detail.component.scss',
})
export class DeckDetailComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly deckService = inject(DeckService);
  private readonly cardService = inject(CardService);
  private readonly toastr = inject(ToastrService);

  deckId = Number(this.route.snapshot.paramMap.get('deckId'));
  deck = signal<Deck | null>(null);
  cards = signal<Card[]>([]);
  loading = signal(true);

  constructor() {
    this.deckService.getDeck(this.deckId).subscribe({
      next: (deck) => this.deck.set(deck),
      error: () => this.toastr.error('Nie udało się wczytać talii')
    });

    this.cardService.getCards(this.deckId).subscribe({
      next: (cards) => {
        this.cards.set(cards);
        this.loading.set(false);
      },
      error: () => {
        this.toastr.error('Nie udało się wczytać kart');
        this.loading.set(false);
      }
    })
  }

}
