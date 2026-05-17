import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="container text-center">
        <p>&copy; 2024 Deli Shey - Pastelería & Panadería Premium ❤️</p>
        <p>Hecho con amor y tonos pastel</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #f9f9f9;
      padding: 40px 0;
      border-top: 1px solid #eee;
      color: #888;
    }
    .text-center { text-align: center; }
  `]
})
export class FooterComponent {}
