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

  constructor(private authService: AuthService) { }

  onSubmit() {

    this.authService
      .forgotPassword(this.email)
      .subscribe({

        next: (res) => {
          this.message = res.message;
          this.error = '';
        },

        error: (err) => {
          this.error = err.error?.message || 'No se pudo enviar el mail';
          this.message = '';
        }

      });

  }

}