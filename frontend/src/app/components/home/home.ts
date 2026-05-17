import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent {
  categories = [
    { 
      name: 'Pastelería', 
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500', 
      description: 'Dulces momentos con ingredientes de alta calidad.',
      details: 'Envíos a domicilio, pedidos personalizados para eventos y frescura garantizada.'
    },
    { 
      name: 'Panadería', 
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500', 
      description: 'Pan artesanal recién horneado cada mañana.',
      details: 'Masa madre tradicional, variedad de granos y harinas premium.'
    },
    { 
      name: 'Regalos', 
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500', 
      description: 'Sorprende a tus seres queridos con detalles únicos.',
      details: 'Cajas decoradas, canastas personalizadas y tarjetas de regalo.'
    }
  ];

  selectedCategory: any = null;

  showDetails(cat: any) {
    this.selectedCategory = this.selectedCategory === cat ? null : cat;
  }
}
