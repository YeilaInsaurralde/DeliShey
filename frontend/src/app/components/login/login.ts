import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  success = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.success = '¡Sesión iniciada con éxito!';
        setTimeout(() => this.router.navigate(['/']), 1500);
      },
      error: (err) => {
        this.error = 'Error al iniciar sesión. Inténtalo de nuevo.';
      }
    });
  }
}
