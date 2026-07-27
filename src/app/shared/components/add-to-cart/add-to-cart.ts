import { Component, inject, input, signal } from '@angular/core';
import { CartService } from '../../services/cart-service';
import { Product } from '../../interfaces/product';
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
    event?.stopPropagation
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