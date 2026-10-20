import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.services';
import { RegisterRequest } from '../../models/auth/register-request.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})

export class Register {

  name = '';
  email = '';
  password = '';
  showPassword = false;
  submitting = false;
  error = '';
  success = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {

    this.error = '';
    if (!this.name.trim() || this.name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim()) || this.password.length < 8 || this.password.length > 72) {
      this.error = 'Ingresá nombre, correo válido y contraseña entre 8 y 72 caracteres';
      return;
    }
    this.submitting = true;
    const registerData: RegisterRequest = {

      name: this.name,
      email: this.email,
      password: this.password

    };

    this.authService.register(registerData)
      .subscribe({

        next: () => {
          this.submitting = false;

          this.success = 'Usuario registrado';

          this.router.navigate(['/login']);

        },

        error: (err) => {
          this.submitting = false;

          this.error = err.error?.message || 'No se pudo registrar';

        }

      });

  }

}
