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
  error = '';
  success = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {

    const registerData: RegisterRequest = {

      name: this.name,
      email: this.email,
      password: this.password

    };

    this.authService.register(registerData)
      .subscribe({

        next: () => {

          this.success = 'Usuario registrado';

          this.router.navigate(['/login']);

        },

        error: (err) => {

          this.error = err.error.message;

        }

      });

  }

}
