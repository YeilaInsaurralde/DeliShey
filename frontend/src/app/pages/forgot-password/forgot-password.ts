import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPassword {

  email = '';
  message = '';
  error = '';
  submitting = false;

  constructor(private authService: AuthService) { }

  onSubmit() {
    this.error = '';
    this.message = '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim())) {
      this.error = 'Ingresá un correo electrónico válido'; return;
    }
    this.submitting = true;

    this.authService
      .forgotPassword(this.email)
      .subscribe({

        next: (res) => {
          this.submitting = false;
          this.message = res.message;
          this.error = '';
        },

        error: (err) => {
          this.submitting = false;
          this.error = err.error?.message || 'No se pudo enviar el mail';
          this.message = '';
        }

      });

  }

}