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

    const { nombre, apellido, email, asunto, mensaje } = this.form.value;

    const textoWhatsApp = `
Hola, soy ${nombre} ${apellido}.
Email: ${email}
Asunto: ${asunto}

Mensaje:
${mensaje}
`;

    console.log('===== EMAIL SIMULADO DEL FORMULARIO =====');
    console.log('Para: contacto@delishey.com');
    console.log(`Asunto: Consulta DeliShey: ${asunto}`);
    console.log(`
Nombre: ${nombre} ${apellido}
Email: ${email}

Mensaje:
${mensaje}
    `);
    console.log('========================================');

    setTimeout(() => {

      const telefono = '54911123456789';

      const urlWhatsApp =
        `https://wa.me/${telefono}?text=${encodeURIComponent(textoWhatsApp)}`;

      window.open(urlWhatsApp, '_blank');

      this.enviado.set(true);
      this.enviando.set(false);
      this.form.reset();

      setTimeout(() => {
        this.enviado.set(false);
      }, 5000);

    }, 1000);
  }

}