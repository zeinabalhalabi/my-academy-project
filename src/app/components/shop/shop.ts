import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IProductCard } from '../../shared/interfaces/product-card';
import { ProductCards } from '../../shared/components/product-cards/product-cards';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, TitleCasePipe, ProductCards], // DO NOT put HttpClientModule here if using provideHttpClient()
  templateUrl: './shop.html',
  styleUrls: ['./shop.css']
})
export class Shop implements OnInit {
  private http = inject(HttpClient);

  products = signal<IProductCard[]>([]);
  categories = signal<string[]>([]);
  selectedCategory = signal<string>('all');
  loading = signal<boolean>(true);

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchProducts();
  }

  fetchCategories(): void {
    this.http.get<string[]>('https://fakestoreapi.com/products/categories')
      .subscribe({
        next: (data) => this.categories.set(['all', ...data]),
        error: (err) => {
          console.error('Error fetching categories:', err);
        }
      });
  }

  fetchProducts(): void {
    this.loading.set(true);
    const category = this.selectedCategory();
    const url = category === 'all'
      ? 'https://fakestoreapi.com/products'
      : `https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`;

    this.http.get<IProductCard[]>(url)
      .subscribe({
        next: (data) => {
          this.products.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error fetching products:', err);
          this.loading.set(false); // Ensures loading screen clears even if API fails
        }
      });
  }

  selectCategory(category: string): void {
    if (this.selectedCategory() !== category) {
      this.selectedCategory.set(category);
      this.fetchProducts();
    }
  }
}