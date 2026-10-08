import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductService } from '../../services/product.services';
import { CartService } from '../../services/cart.services';
import { AuthService } from '../../services/auth.services';
import { RatingService, ProductRatingsSummary } from '../../services/rating.services';
import { Product } from '../../models/products/products.models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss']
})
export class ProductListComponent implements OnInit {

  categoryName: string = '';
  products: Product[] = [];

  notification: string | null = null;
  notificationType: 'success' | 'error' = 'success';

  // Para dibujar las 5 estrellas
  stars = [1, 2, 3, 4, 5];

  // Ventanita (modal) con las reseñas de un producto
  showModal = false;
  modalProduct: Product | null = null;
  modalData: ProductRatingsSummary | null = null;
  modalLoading = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    public authService: AuthService,
    private ratingService: RatingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryName = params['type'];
      this.loadProductsByCategory();
    });
  }

  loadProductsByCategory(): void {
    this.productService.getProductsByCategory(this.categoryName).subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error al cargar productos por categoría', error);
        this.showNotification('Error al cargar productos.', 'error');
      }
    });
  }

  addToCart(product: Product): void {
    if (!this.authService.isLoggedIn()) {
      this.showNotification(
        'Debes iniciar sesión para agregar productos.',
        'error'
      );

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);

      return;
    }

    const success = this.cartService.addToCart(product);

    if (success) {
      this.showNotification(
        `¡${product.name} agregado al carrito!`,
        'success'
      );
    }
  }

  showNotification(message: string, type: 'success' | 'error'): void {
    this.notification = message;
    this.notificationType = type;

    setTimeout(() => {
      this.notification = null;
    }, 3000);
  }

  // Redondea el promedio para saber cuántas estrellas pintar llenas
  roundedRating(avg: number | undefined | null): number {
    return avg ? Math.round(avg) : 0;
  }

  // Abre la ventanita con las reseñas de un producto
  openReviews(product: Product): void {
    this.modalProduct = product;
    this.showModal = true;
    this.modalLoading = true;
    this.modalData = null;

    this.ratingService.getProductRatings(product.id).subscribe({
      next: (data) => {
        this.modalData = data;
        this.modalLoading = false;
      },
      error: () => {
        this.modalLoading = false;
      }
    });
  }

  closeModal(): void {
    this.showModal = false;
  }
}