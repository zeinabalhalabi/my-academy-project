import { Component, OnInit, inject, signal, computed} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IProductCard } from '../../shared/interfaces/product-card';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop.html',
  styleUrls: ['./shop.css']
})
export class Shop implements OnInit {
  private http = inject(HttpClient);
  //signal state
  products = signal<IProductCard[]>([]);
  categories = signal<string[]>([]);
  selectedCategory = signal<string>('all');
  loading = signal<boolean>(true);

//runs automatically when comp loads to get categories and products
  ngOnInit(): void {
    this.fetchCategories();
    this.fetchProducts();
  }

  fetchCategories(): void {
    this.http.get<string[]>('https://fakestoreapi.com/products/categories')
      .subscribe({
        next: (data) => { //puts the categories here and we add an 'all' option
          this.categories.set(['all', ...data])
        },
        error: (err) => console.error('Error fetching categories:', err)
      });
  }

  fetchProducts(): void {
    this.loading.set(true); 
    const category = this.selectedCategory();
    //if 'all' it fetches all products, else it calls /products/category
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
          this.loading.set(false);
        }
      });
  }
  //this detects when a new cat is clicked in the html so it loads the new prods
  selectCategory(category: string): void {
    if (this.selectedCategory() !== category) {
      this.selectedCategory.set(category);
      this.fetchProducts();
    }
  }
}