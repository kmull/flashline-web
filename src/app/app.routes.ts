import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DeckDetailComponent } from './decks/deck-detail/deck-detail.component';
import { DeckFormComponent } from './decks/deck-form/deck-form.component';
import { DeckImportComponent } from './decks/deck-import/deck-import.component';
import { DeckListComponent } from './decks/deck-list/deck-list.component';
import { authGuard } from './shared/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'decks', component: DeckListComponent, canActivate: [authGuard] },
  { path: 'decks/new', component: DeckFormComponent, canActivate: [authGuard] },
  { path: 'decks/:deckId/import', component: DeckImportComponent, canActivate: [authGuard] },
  { path: 'decks/:deckId', component: DeckDetailComponent, canActivate: [authGuard] },

  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
