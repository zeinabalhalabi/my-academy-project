import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IProductCard } from '../../shared/interfaces/product-card';
import { ProductCards } from '../../shared/components/product-cards/product-cards';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../shared/services/product-service';

type SortOption =
  | 'most-popular'
  | 'highest-rating'
  | 'price-low-high'
  | 'price-high-low'
  | 'a-z';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, TitleCasePipe, ProductCards, RouterLink],
  templateUrl: './shop.html',
  styleUrls: ['./shop.css']
})

export class Shop implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  allProducts = signal<IProductCard[]>([]);
  searchQuery = signal<string>('');

  products = signal<IProductCard[]>([]);
  categories = signal<string[]>([]);
  selectedCategory = signal<string>('all');
  selectedSort = signal<SortOption>('most-popular');
  loading = signal<boolean>(true);
   
  ngOnInit(): void {
    this.fetchCategories();
    // Removed route.queryParams from here to fix the injection context error
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
          this.products.set(data || []);
          this.loading.set(false);
          this.sortProducts();
        },
        error: (err) => {
          console.error('Error fetching products:', err);
          this.loading.set(false);
        }
      });
  }

  selectCategory(category: string): void {
    if (this.selectedCategory() !== category) {
      this.selectedCategory.set(category);
      this.fetchProducts();
    }
  }

  onSortChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const sortOption = selectElement.value as SortOption;

    this.selectedSort.set(sortOption);
    this.sortProducts();
  }

  private sortProducts(): void {
    const sortedProducts = [...this.products()];
    const sortOption = this.selectedSort();

    if (sortOption === 'most-popular') {
      sortedProducts.sort((a, b) => b.rating.count - a.rating.count);
    }
    if (sortOption === 'highest-rating') {
      sortedProducts.sort((a, b) => b.rating.rate - a.rating.rate);
    }
    if (sortOption === 'price-low-high') {
      sortedProducts.sort((a, b) => a.price - b.price);
    }
    if (sortOption === 'price-high-low') {
      sortedProducts.sort((a, b) => b.price - a.price);
    }
    if (sortOption === 'a-z') {
      sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
    }
    this.products.set(sortedProducts);
  }

  filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const productsList = this.products();

    if (!query) return productsList;
    
    return productsList.filter(product => {
      const titleMatch = product.title?.toLowerCase().includes(query) ?? false;
      const categoryMatch = product.category?.toLowerCase().includes(query) ?? false;

      return titleMatch || categoryMatch;
    });
  });

  constructor() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.allProducts.set(products);
      },
      error: (err) => {
        console.error('Failed to load products', err);
      }
    });

    // Handle both category and search query parameters safely inside the injection context
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe(params => {
      const cat = params['category'];
      if (cat && cat !== this.selectedCategory()) {
        this.selectedCategory.set(cat);
        this.fetchProducts();
      }

      const searchParam = params['search'] || '';
      this.searchQuery.set(searchParam);
    });
  }
}