import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RegisterRequest } from '../auth.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register.component',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toastr = inject(ToastrService);
  private readonly router = inject(Router);

  errorMessage: string | null = null;

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    const { email, password } = this.registerForm.value;

    this.authService.register({ email, password } as RegisterRequest).subscribe({
      next: () => {
        this.toastr.success('Rejestracja zakończona sukcesem. Możesz teraz się zalogować.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const message = err.status === 409
          ? 'Konto z tym adresem email już istnieje'
          : 'Rejestracja nie powiodła się';
        this.toastr.error(message);
      }
    });
  }

}
