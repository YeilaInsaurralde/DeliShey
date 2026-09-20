import { Component, inject, signal, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { STORE_CONFIG } from '../../config/store.config';
import { ContactoService } from '../../services/contacto.services';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.scss',
})
export class Contacto implements AfterViewInit {

  private fb = inject(FormBuilder);
  private contactoService = inject(ContactoService);

  // Link del botón flotante de WhatsApp
  whatsappUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}`;

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
    this.enviado.set(false);

    this.contactoService.enviar(this.form.value).subscribe({

      next: () => {
        this.enviando.set(false);
        this.enviado.set(true);
        this.form.reset();

        setTimeout(() => {
          this.enviado.set(false);
        }, 5000);
      },

      error: (err) => {
        this.enviando.set(false);
        this.errorEnvio.set(
          err.error?.message ||
          'No se pudo enviar el mensaje. Probá de nuevo más tarde.'
        );
      }

    });
  }

}