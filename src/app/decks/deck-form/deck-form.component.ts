import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeckService } from '../deck.service';

@Component({
  selector: 'app-deck-form.component',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],

  templateUrl: './deck-form.component.html',
  styleUrl: './deck-form.component.scss',
})
export class DeckFormComponent {

  private readonly fb = inject(FormBuilder);
  private readonly deckService = inject(DeckService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  deckForm = this.fb.group({
    name: ['', [Validators.required]],
    category: ['']
  });


  onSubmit(): void {
    if (this.deckForm.invalid) {
      return;
    }

    const { name, category } = this.deckForm.getRawValue();

    this.deckService.createDeck({ name: name!, category: category || null }).subscribe({
      next: () => {
        this.toastr.success('Talia utworzona');
        this.router.navigate(['/decks']);
      },
      error: () => this.toastr.error('Nie udało się utworzyć talii')
    })
  }

}
