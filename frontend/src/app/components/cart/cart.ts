import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { STORE_CONFIG } from '../../config/store.config';

import { CartService, CartItem } from '../../services/cart.services';
import { OrderService } from '../../services/order.services';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class CartComponent implements OnInit {

  cartItems: CartItem[] = [];
  shippingCost = STORE_CONFIG.shippingCost;

  constructor(
    public cartService: CartService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe(items => {
      this.cartItems = items;
    });
  }

  get subtotal(): number {
    return this.cartService.getCartTotal();
  }

  get total(): number {
    return this.subtotal + this.shippingCost;
  }

  updateQuantity(id: number, quantity: number): void {
    this.cartService.updateQuantity(id, quantity);
  }

  remove(id: number): void {
    this.cartService.removeFromCart(id);
  }

  checkout(): void {

    const items = this.cartItems.map(item => ({
      productId: item.id,
      quantity: item.quantity
    }));

    const finishCheckout = () => {
      this.cartService.generateWhatsAppMessage();
      this.cartService.clearCart();
    };

    this.orderService.createOrder(items, this.shippingCost).subscribe({
      next: finishCheckout,
      error: finishCheckout
    });
  }
}