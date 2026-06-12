import { Component, inject, signal, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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

  form: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    asunto: ['', Validators.required],
    mensaje: ['', [Validators.required, Validators.minLength(10)]],
  });

  enviado = signal(false);
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

    const { nombre, apellido, email, asunto, mensaje } = this.form.value;

    const texto = `
Hola, soy ${nombre} ${apellido}.
Email: ${email}
Asunto: ${asunto}

Mensaje:
${mensaje}
`;

    const telefono = '54911sinpuntosniguiones';//pones el NUMERO DE TU WHATS Y TE REDIRIGE EL MENSAJE

    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(texto)}`;

    window.open(url, '_blank');

    this.enviado.set(true);
    this.errorEnvio.set('');

    this.form.reset();

    setTimeout(() => {
      this.enviado.set(false);
    }, 5000);
  }

}