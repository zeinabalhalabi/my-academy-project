import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  id: string;
  name: string;
  color: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})

export class CartService {
readonly cartItems = signal<CartItem[]>([]);

readonly subtotal = computed(() =>
    this.cartItems().reduce((sum, item) => sum + (item.price * item.quantity), 0)
);

readonly shipping = computed(() =>
  this.cartItems().length > 0 ? 10 : 0
);

readonly grandTotal = computed(() =>
  this.subtotal() + this.shipping()
);

addToCart(product: Omit<CartItem, 'quantity'>, quantity: number = 1): void {
    this.cartItems.update(items => {
      const existingIndex = items.findIndex(item => item.id === product.id && item.color === product.color);
      if (existingIndex > -1) {
        const updated = [...items];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...items, { ...product, quantity: quantity }];
    });
  }

updateQuantity(id: string, delta: number): void {
    this.cartItems.update(items => 
      items.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  }

removeItem(id: string): void {
    this.cartItems.update(items => items.filter(item => item.id !== id));
  }
}
