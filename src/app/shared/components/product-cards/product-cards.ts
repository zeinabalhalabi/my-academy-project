import { Component, input, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { IProductCard } from '../../interfaces/product-card';
import { Product } from '../../interfaces/product';
import { AddToCart } from '../add-to-cart/add-to-cart';

@Component({
  selector: 'app-product-cards',
  standalone: true,
  imports: [CurrencyPipe, AddToCart],
  templateUrl: './product-cards.html',
  styleUrl: './product-cards.css',
})
export class ProductCards {
  product = input.required<IProductCard>();
  private router = inject(Router);

  // Converts IProductCard to Product interface required by AddToCart
  adaptedProduct = computed<Product>(() => {
    const p = this.product();
    return {
      id: p.id,
      title: p.title,
      price: p.price,
      description: p.description,
      category: p.category,
      image: p.image,
      rating: p.rating
    };
  });

  goToDetails(): void {
    this.router.navigate(['/product', this.product().id]);
  }
}