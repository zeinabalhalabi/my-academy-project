import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../shared/services/cart-service';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  protected cartService = inject(CartService);

  cartItems = this.cartService.cartItems;
  subtotal = this.cartService.subtotal;
  grandTotal = this.cartService.grandTotal;

    onQuantityChange(id: string, delta: number): void {
    this.cartService.updateQuantity(id, delta);
  }

  onRemove(id: string): void {
    this.cartService.removeItem(id);
  }
}
