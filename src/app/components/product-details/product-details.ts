import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AddToCart } from '../../shared/components/add-to-cart/add-to-cart';
import { ProductCards } from '../../shared/components/product-cards/product-cards'; // <-- IMPORT THIS
import { IProductCard } from '../../shared/interfaces/product-card';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [AddToCart, ProductCards], // <-- ADD IT HERE
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  
  product = signal<IProductCard | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Type this as IProductCard[] to match the ProductCards component
  relatedProducts = signal<IProductCard[]>([]); 

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  loadProduct(id: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.http.get<IProductCard>(`https://fakestoreapi.com/products/${id}`).subscribe({
      next: (data) => {
        this.product.set(data);
        this.isLoading.set(false);
        if (data.category){
          this.fetchRelatedProducts(data.category, data.id);
        }
      },
      error: (err) => {
        console.error('Failed to fetch product', err);
        this.error.set('Failed to load product details.');
        this.isLoading.set(false);
      }
    });
  }

  fetchRelatedProducts(category: string, currentId: number | string): void {
    this.http.get<IProductCard[]>(`https://fakestoreapi.com/products/category/${category}`).subscribe({
      next: (items) => {
        const filtered = items
          .filter((item) => String(item.id) !== String(currentId))
          .slice(0, 4);
        this.relatedProducts.set(filtered);
      },
      error: () => this.relatedProducts.set([])
    });
  }
}