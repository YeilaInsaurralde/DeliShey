import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RatingService, PurchasedProduct } from '../../services/rating.services';

@Component({
  selector: 'app-mis-compras',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-compras.html',
  styleUrl: './mis-compras.scss'
})
export class MisCompras implements OnInit {

  products: PurchasedProduct[] = [];
  loading = false;
  error = '';
  savedId: number | null = null;

  // Para dibujar las 5 estrellas
  stars = [1, 2, 3, 4, 5];

  constructor(private ratingService: RatingService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';

    this.ratingService.getMyPurchases().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar tus compras';
        this.loading = false;
      }
    });
  }

  setRating(product: PurchasedProduct, value: number): void {
    product.rating = value;
  }

  save(product: PurchasedProduct): void {
    if (!product.rating) {
      return;
    }

    this.ratingService.rateProduct(product.id, product.rating, product.comment || '').subscribe({
      next: () => {
        this.savedId = product.id;
        setTimeout(() => {
          if (this.savedId === product.id) {
            this.savedId = null;
          }
        }, 2500);
      },
      error: () => {
        this.error = 'No se pudo guardar la calificación';
      }
    });
  }
}