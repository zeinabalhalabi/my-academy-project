import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProductCard } from '../interfaces/product-card';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'https://fakestoreapi.com/products';

  getProducts() {
    return this.http.get<IProductCard[]>(this.apiUrl);
  }

  getProductsByCategory(category: string) {
    return this.http.get<IProductCard[]>(`${this.apiUrl}/category/${category}`);
  }
}