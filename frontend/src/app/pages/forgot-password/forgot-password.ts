import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.services';
import { Router } from '@angular/router';

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

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit() {

    this.authService
      .forgotPassword(this.email)
      .subscribe({

        next: (res) => {

          this.router.navigate([
            '/reset-password',
            res.token
          ]);

        },       

        error: (err) => {

          this.error = err.error.message;
          this.message = '';

        }

      });

  }

}
