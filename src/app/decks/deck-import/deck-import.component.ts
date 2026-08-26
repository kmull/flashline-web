import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeckService } from '../deck.service';
import { ImportService } from '../import/import.service';

type ImportMode = 'batch' | 'withText';

@Component({
  selector: 'app-deck-import.component',
  imports: [
    FormsModule,
    MatTabsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './deck-import.component.html',
  styleUrl: './deck-import.component.scss',
})
export class DeckImportComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly deckService = inject(DeckService);
  private readonly importService = inject(ImportService);
  private readonly toastr = inject(ToastrService);

  deckId = Number(this.route.snapshot.paramMap.get('deckId'));
  deckName = signal('');
  mode = signal<ImportMode>('batch');
  jsonText = signal('');
  submitting = signal(false);

  constructor() {
    this.deckService.getDeck(this.deckId).subscribe({
      next: (deck) => this.deckName.set(deck.name)
    })
  }

  // Wklejone dosłownie z instrukcja_generowania_fiszek.md — jedyne
  // miejsce, gdzie ta treść żyje w kodzie frontu; jeśli zmienisz
  // dokument, pamiętaj o synchronizacji tutaj.
  private readonly PROMPT_SLOWNICZEK = `Poniżej wklejam fragment mojego słowniczka technicznego (Java/Spring/Angular).
Dla KAŻDEGO pojęcia w tym fragmencie stwórz DWIE fiszki:

1. Typ RECALL — pytanie o definicję pojęcia PO POLSKU, odpowiedź to
   krótkie, własnymi słowami sformułowane wyjaśnienie. Dodatkowo wypełnij
   pole "extendedInfo" — dłuższy tekst (3-6 zdań) z zaletami, wadami/
   zagrożeniami, przykładem użycia i sugestią kiedy stosować.

2. Typ TRANSLATE — jedno kluczowe zdanie definicji PO POLSKU jako
   "question", tłumaczenie na angielski jako "fullText" w "content",
   plus 1-2 alternatywne warianty w "acceptedFullAnswers". "extendedInfo"
   zostaw jako null.

KATEGORIA każdej karty: nazwa pojęcia.

FORMAT WYJŚCIA — zwróć WYŁĄCZNIE poprawny JSON, bez tekstu przed/po, bez
bloków \`\`\`, dokładnie: {"cards": [{"type": "RECALL", "suggestedMode": null, "category": "...",
"question": "...", "content": {"type": "GAP_BASED", "fullText": "...", "gapText": null, "acceptedFullAnswers": [],
"gaps": []}, "audioUrl": null, "extendedInfo": "...", "level": null}, {"type": "TRANSLATE", ...}]}

--- WKLEJ FRAGMENT SŁOWNICZKA PONIŻEJ ---`;

  private readonly PROMPT_TEXT = (kategoria: string) =>
    `Jesteś generatorem materiału do nauki metodą spaced repetition.

TEMAT: [wpisz temat]
KATEGORIA: ${kategoria}
POZIOM TRUDNOŚCI: [A1/A2/B1/B2/C1/C2]
LICZBA FISZEK: [liczba]

Napisz tekst (150-300 słów) na powyższy temat, potem wygeneruj fiszki
WYŁĄCZNIE na podstawie tego tekstu. Zwróć WYŁĄCZNIE poprawny JSON, bez
bloków \`\`\`, w strukturze ImportSourceTextRequest: {"title": "...", "category": "${kategoria}",
"content": "...", "level": "...", "cards": [{"type": "RECALL", "suggestedMode": "GAP_FILL",
"category": "${kategoria}", "question": "...", "content": {"type": "GAP_BASED", "fullText": "...",
"gapText": "...", "acceptedFullAnswers": [], "gaps": [{"id": 1, "acceptedAnswers": ["..."],
"options": [], "hint": null}]}, "audioUrl": null, "extendedInfo": null, "level": "..."}]}`;


  copySlowniczekPrompt(): void {
    navigator.clipboard.writeText(this.PROMPT_SLOWNICZEK);
    this.toastr.success('Instrukcja skopiowana — wklej do AI');
  }

  copyTextPrompt(): void {
    navigator.clipboard.writeText(this.PROMPT_TEXT(this.deckName()));
    this.toastr.success('Instrukcja skopiowana — wklej do AI');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => this.jsonText.set(reader.result as string);
    reader.readAsText(file);
  }

  submitImport(): void {
    let parsed: unknown;
    try {
      parsed = JSON.parse(this.jsonText());
    } catch {
      this.toastr.error('To nie jest poprawny JSON — sprawdź czy nic nie ucięło się przy kopiowaniu');
      return;
    }

    this.submitting.set(true);
    const request$ = this.mode() === 'batch'
      ? this.importService.importBatch(this.deckId, parsed as { cards: unknown[] })
      : this.importService.importWithText(this.deckId, parsed as any);

    request$.subscribe({
      next: (response) => {
        this.submitting.set(false);
        const count = response.cardsImported ?? 0;
        this.toastr.success(`Zaimportowano ${count} fishek`);
        this.router.navigate(['/decks', this.deckId]);
      },
      error: () => {
        this.submitting.set(false);
        this.toastr.error('Import się nie powiódł — sprawdź kształt JSON-a względem wybranego trybu');
      }
    });
  }


}
