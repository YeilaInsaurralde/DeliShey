import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/products/products.models';
import { ProductService } from '../../services/product.services';
import { CartService } from '../../services/cart.services';
import { AuthService } from '../../services/auth.services';

interface ChristmasIdea {
  name: string;
  description: string;
  image: string;
  key: string;
}

@Component({
  selector: 'app-christmas-special',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './christmas-special.html',
  styleUrl: './christmas-special.scss'
})
export class ChristmasSpecial implements OnInit {
  readonly ideas: ChristmasIdea[] = [
    { name: 'Galletas de jengibre', description: 'Decoradas con glasé y motivos de las fiestas.', image: '/assets/navidad/galletas-jengibre.jpg', key: 'galletas' },
    { name: 'Rosca navideña', description: 'Crema suave, frutas y un toque de azúcar impalpable.', image: '/assets/navidad/rosca-navidena.jpg', key: 'rosca' },
    { name: 'Torta glaseada', description: 'Una propuesta especial para compartir en familia.', image: '/assets/navidad/torta-glaseada.jpg', key: 'torta' },
    { name: 'Trufas de chocolate', description: 'Pequeños bocados para regalar y disfrutar.', image: '/assets/navidad/trufas-chocolate.jpg', key: 'trufas' },
    { name: 'Pan dulce', description: 'Clásico de las fiestas, con frutas y frutos secos.', image: '/assets/navidad/pan-dulce.jpg', key: 'pan-dulce' },
    { name: 'Caja navideña', description: 'Surtido dulce para regalar en estas fiestas.', image: '/assets/navidad/caja-navidena.jpg', key: 'caja' }
  ];

  get collectionOnly(): boolean { return this.router.url.startsWith('/especiales/coleccion'); }

  products: Product[] = [];
  selectedProductId: number | null = null;

  get selectedIdea(): ChristmasIdea | undefined {
    return this.ideas.find(idea => idea.key === this.route.snapshot.queryParamMap.get('producto'));
  }
  loading = true;
  loadError = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Reúne novedades navideñas de TODAS las categorías, sin cambios en MySQL.
    // Además de la categoría Navidad, reconoce los nombres de los productos destacados.
    this.productService.getProducts().subscribe({
      next: products => {
        const christmasProducts = products.filter(product => this.isChristmasProduct(product));
        const selected = this.selectedIdea;
        const featured = selected
          ? christmasProducts.find(product => this.matchesIdea(product.name, selected.key))
          : undefined;
        this.selectedProductId = featured?.id ?? null;
        this.products = featured
          ? [featured, ...christmasProducts.filter(product => product.id !== featured.id)]
          : christmasProducts;
        this.loading = false;
      },
      error: () => { this.loadError = true; this.loading = false; }
    });
  }

  private isChristmasProduct(product: Product): boolean {
    if (product.category === 'Navidad') return true;
    const title = product.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    return /navid|pan dulce|panettone|jengibre|rosca|trufas|torta glaseada|caja festiva|caja de fiestas/.test(title);
  }

  openCollection(): void {
    this.router.navigate(['/especiales/coleccion']);
  }

  openSpecials(): void {
    this.router.navigate(['/especiales']);
  }

  private matchesIdea(name: string, key: string): boolean {
    const title = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const matches: Record<string, RegExp> = {
      galletas: /jengibre|galletas? .*navid/,
      rosca: /rosca/,
      torta: /torta glaseada/,
      trufas: /trufas/,
      'pan-dulce': /pan dulce|panettone/,
      caja: /caja navid|caja festiva|caja de fiestas/
    };
    return matches[key]?.test(title) ?? false;
  }

  openIdea(key: string): void {
    this.router.navigate(['/especiales/coleccion'], { queryParams: { producto: key } });
  }

  addToCart(product: Product): void {
    if (!this.authService.isLoggedIn()) {
      this.messageType = 'error';
      this.message = 'Iniciá sesión para agregar productos a tu carrito.';
      this.router.navigate(['/login']);
      return;
    }
    const added = this.cartService.addToCart(product);
    this.messageType = added ? 'success' : 'error';
    this.message = added ? `${product.name} agregado al carrito.` : 'No se pudo agregar el producto.';
  }
}
