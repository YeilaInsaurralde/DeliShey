import { Component, inject, signal, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.scss',
})
export class Contacto implements AfterViewInit {

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  private readonly API_URL = 'http://localhost:3000/api/contacto';

  form: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    asunto: ['', Validators.required],
    mensaje: ['', [Validators.required, Validators.minLength(10)]],
  });

  enviado = signal(false);
  enviando = signal(false);
  errorEnvio = signal('');

  get nombre() { return this.form.get('nombre')!; }
  get apellido() { return this.form.get('apellido')!; }
  get email() { return this.form.get('email')!; }
  get asunto() { return this.form.get('asunto')!; }
  get mensaje() { return this.form.get('mensaje')!; }

  ngAfterViewInit(): void {
    const campoNombre =
      document.getElementById('campo-nombre') as HTMLInputElement;

    campoNombre?.focus();
  }

  enviar(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    this.errorEnvio.set('');

    this.http.post(this.API_URL, this.form.value)
      .subscribe({

        next: () => {

          this.enviado.set(true);
          this.enviando.set(false);

          this.form.reset();

          setTimeout(() => {
            this.enviado.set(false);
          }, 5000);

        },

        error: (err) => {

          console.error(err);

          this.enviando.set(false);

          this.errorEnvio.set(
            err.status === 0
              ? 'No se pudo conectar con el servidor.'
              : 'Hubo un error al enviar el mensaje.'
          );

        }

      });

  }

}