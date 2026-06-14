import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.services';
import { Product } from '../models/products/products.models';

export interface CartItem extends Product {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  public items$ = this.itemsSubject.asObservable();

  constructor(private authService: AuthService) {}

  addToCart(product: Product): boolean {
    if (!this.authService.isLoggedIn()) {
      return false;
    }

    const currentItems = this.itemsSubject.value;

    const existingItem = currentItems.find(
      item => item.id === product.id
    );

    if (existingItem) {
      existingItem.quantity += 1;
      this.itemsSubject.next([...currentItems]);
    } else {
      const newItem: CartItem = {
        ...product,
        price: Number(product.price),
        quantity: 1
      };

      this.itemsSubject.next([...currentItems, newItem]);
    }

    return true;
  }

  removeFromCart(productId: number): void {
    const currentItems = this.itemsSubject.value.filter(
      item => item.id !== productId
    );

    this.itemsSubject.next(currentItems);
  }

  updateQuantity(productId: number, quantity: number): void {
    const currentItems = this.itemsSubject.value;

    const item = currentItems.find(
      item => item.id === productId
    );

    if (item) {
      item.quantity = Math.max(1, quantity);
      this.itemsSubject.next([...currentItems]);
    }
  }

  getCartTotal(): number {
    return this.itemsSubject.value.reduce(
      (total, item) => total + Number(item.price) * item.quantity,
      0
    );
  }

  getCartCount(): number {
    return this.itemsSubject.value.reduce(
      (count, item) => count + item.quantity,
      0
    );
  }

  generateWhatsAppMessage(): void {
    const user = this.authService.getCurrentUser();
    const items = this.itemsSubject.value;

    const subtotal = this.getCartTotal();
    const shipping = 5.00;
    const total = subtotal + shipping;

    let message = `Hola Deli Shey! Mi nombre es ${user.name} (${user.email}). Quisiera realizar el siguiente pedido:\n\n`;

    items.forEach(item => {
      message += `- ${item.name} (x${item.quantity}): $${(Number(item.price) * item.quantity).toFixed(2)}\n`;
    });

    message += `\nSubtotal: $${subtotal.toFixed(2)}`;
    message += `\nEnvío: $${shipping.toFixed(2)}`;
    message += `\nTotal: $${total.toFixed(2)}`;
    message += `\n\nGracias!`;

    const encodedMessage = encodeURIComponent(message);

    window.open(
      `https://wa.me/5491123456789?text=${encodedMessage}`,
      '_blank'
    );
  }

  clearCart(): void {
    this.itemsSubject.next([]);
  }
}
