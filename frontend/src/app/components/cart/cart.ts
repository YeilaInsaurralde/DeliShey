import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CartService, CartItem } from '../../services/cart.services';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class CartComponent implements OnInit {

  cartItems: CartItem[] = [];
  shippingCost = 5.00;

  constructor(public cartService: CartService) {}

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
    this.cartService.generateWhatsAppMessage();
  }
}

