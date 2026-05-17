import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../services/product';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';

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

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.categoryName = params['type'];
      this.loadProducts();
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe(allProducts => {
      this.products = allProducts.filter(p => p.category === this.categoryName);
    });
  }

  addToCart(product: Product) {
    if (!this.authService.isLoggedIn()) {
      this.showNotification('Debes iniciar sesión para agregar productos.', 'error');
      setTimeout(() => this.router.navigate(['/login']), 2000);
      return;
    }

    const success = this.cartService.addToCart(product);
    if (success) {
      this.showNotification(`¡${product.name} agregado al carrito!`, 'success');
    }
  }

  showNotification(message: string, type: 'success' | 'error') {
    this.notification = message;
    this.notificationType = type;
    setTimeout(() => this.notification = null, 3000);
  }
}
