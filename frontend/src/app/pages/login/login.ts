import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.services';
import { LoginRequest } from '../../models/auth/login-request.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})

export class Login {

  email = '';
  password = '';
  showPassword = false;
  submitting = false;
  error = '';
  success = '';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {

    this.error = '';
    this.success = '';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim()) || !this.password) {
      this.error = 'Ingresá un correo válido y tu contraseña';
      return;
    }
    this.submitting = true;
    const loginData: LoginRequest = {

      email: this.email,
      password: this.password

    };

    this.authService.login(loginData)
      .subscribe({

        next: (response) => {
          this.submitting = false;

          this.authService.saveToken(response.token);

          localStorage.setItem(
            'user',
            JSON.stringify(response.user)
          );

          this.success = 'Login exitoso';

          this.router.navigate(['/']);

        },

        error: (err) => {
          this.submitting = false;

          this.error =
            err.error?.message || 'Error al iniciar sesión';

        }

      });

  }

}