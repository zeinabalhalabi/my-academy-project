import { Component, inject, input, signal } from '@angular/core';
import { CartService } from '../../services/cart-service';
import { Product } from '../../interfaces/product';
import { AuthService } from '../../../core/auth/auth-service';
import { Router } from '@angular/router';
// Interface matching FakeStoreApi product structure

@Component({
  selector: 'app-add-to-cart',
  standalone: true,
  imports: [],
  templateUrl: './add-to-cart.html',
  styleUrl: './add-to-cart.css',
})
export class AddToCart {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);
  // Inputs for product data and stock limit
  product = input.required<Product>();
  maxStock = input<number>(20);

  // State signal for local quantity picker
  quantity = signal<number>(1);

  updateQuantity(delta: number, event?: MouseEvent): void {
    event?.stopPropagation();
    const next = this.quantity() + delta;
    if (next >= 1 && next <= this.maxStock()) {
      this.quantity.set(next);
    }
  }

  onAddToCart(): void {
     // Check if the user is logged in
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    
    const item = this.product();
    const selectedQty = this.quantity();

    // Send item and chosen quantity to global CartService
    this.cartService.addToCart(
      {
        id: String(item.id),
        name: item.title,
        color: 'Standard',
        price: item.price,
        imageUrl: item.image,
      },
      selectedQty
    );

    // Reset picker back to 1
    this.quantity.set(1);
  }
}