import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPassword {

  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;
  submitting = false;

  error = '';
  success = '';

  token = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {

    this.token =
      this.route.snapshot.paramMap.get('token') || '';

  }

  onSubmit() {

    this.error = '';
    this.success = '';

    if (this.password.length < 8 || this.password.length > 72) { this.error = 'La contraseña debe tener entre 8 y 72 caracteres'; return; }
    if (
      this.password !==
      this.confirmPassword
    ) {

      this.error =
        'Las contraseñas no coinciden';

      return;

    }

    this.submitting = true;
    this.authService
      .resetPassword(
        this.token,
        this.password
      )
      .subscribe({

        next: (res) => {
          this.submitting = false;

          this.success =
            res.message;

          setTimeout(() => {

            this.router.navigate(
              ['/login']
            );

          }, 2000);

        },

        error: (err) => {
          this.submitting = false;

          this.error =
            err.error?.message || 'No se pudo cambiar la contraseña';

        }

      });

  }

}