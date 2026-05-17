import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './product';
import { AuthService } from './auth';

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

  addToCart(product: Product) {
    if (!this.authService.isLoggedIn()) {
      return false;
    }

    const currentItems = this.itemsSubject.value;
    const existingItem = currentItems.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
      this.itemsSubject.next([...currentItems]);
    } else {
      this.itemsSubject.next([...currentItems, { ...product, quantity: 1 }]);
    }
    return true;
  }

  removeFromCart(productId: number) {
    const currentItems = this.itemsSubject.value.filter(item => item.id !== productId);
    this.itemsSubject.next(currentItems);
  }

  updateQuantity(productId: number, quantity: number) {
    const currentItems = this.itemsSubject.value;
    const item = currentItems.find(item => item.id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.itemsSubject.next([...currentItems]);
    }
  }

  getCartTotal() {
    return this.itemsSubject.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCartCount() {
    return this.itemsSubject.value.reduce((count, item) => count + item.quantity, 0);
  }

  generateWhatsAppMessage() {
    const user = this.authService.getCurrentUser();
    const items = this.itemsSubject.value;
    const subtotal = this.getCartTotal();
    const shipping = 5.00;
    const total = subtotal + shipping;

    let message = `Hola Deli Shey! Mi nombre es ${user.name} (${user.email}). Quisiera realizar el siguiente pedido:\n\n`;
    
    items.forEach(item => {
      message += `- ${item.name} (x${item.quantity}): $${(item.price * item.quantity).toFixed(2)}\n`;
    });

    message += `\nSubtotal: $${subtotal.toFixed(2)}`;
    message += `\nEnvío: $${shipping.toFixed(2)}`;
    message += `\nTotal: $${total.toFixed(2)}`;
    message += `\n\nGracias!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/1234567890?text=${encodedMessage}`, '_blank');
  }

  clearCart() {
    this.itemsSubject.next([]);
  }
}
