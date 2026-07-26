import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
export interface IProduct{
  id: number;
  title: string;
  price: number;
  description: string,
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  }
}

@Component({
  selector: 'app-product-details',
  standalone: true,
  //import add to cart component here
  imports: [],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit{
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  //signals for state
  product = signal < IProduct | null> (null);
  isLoading = signal<boolean>(true);
  error = signal <string | null>(null);

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

    //call fakestoreapi directly
    this.http.get<IProduct>('https://fakestoreapi.com/products/${id}').subscribe({
      next: (data) => {
        this.product.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch product', err);
        this.error.set('Failed to load product details.');
        this.isLoading.set(false);
      }
    });
  }

  handleAddToCart(event: { quantity: number }): void {
    const currentProduct = this.product();
    if (!currentProduct) return;

    console.log('Added to cart:', {
      productId: currentProduct.id,
      title: currentProduct.title,
      price: currentProduct.price,
      quantity: event.quantity
    });
  }


}
