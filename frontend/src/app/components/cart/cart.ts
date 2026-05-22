import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class CartComponent {
  shippingCost = 5.0;

  constructor(public cartService: CartService) {}

  get subtotal() {
    return this.cartService.getCartTotal();
  }

  get total() {
    return this.subtotal + this.shippingCost;
  }

  updateQuantity(id: number, q: number) {
    this.cartService.updateQuantity(id, q);
  }

  remove(id: number) {
    this.cartService.removeFromCart(id);
  }

  checkout() {
    this.cartService.generateWhatsAppMessage();
  }
}

