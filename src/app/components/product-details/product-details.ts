import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AddToCart } from '../../shared/components/add-to-cart/add-to-cart';
import { Product } from '../../shared/interfaces/product';
import { IProductCard } from '../../shared/interfaces/product-card';

@Component({
  selector: 'app-product-details',
  standalone: true,
  //import add to cart component here
  imports: [AddToCart],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit{
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  //signals for state
  product = signal < IProductCard | null> (null);
  isLoading = signal<boolean>(true);
  error = signal <string | null>(null);

  relatedProducts = signal<Product[]>([]);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id') || '1';
      if (id) {
      this.loadProduct(id);
      }
    });
  }
  loadProduct(id: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    //call fakestoreapi directly
    this.http.get<IProductCard>('https://fakestoreapi.com/products/${id}').subscribe({
      next: (data) => {
        this.product.set(data);
        this.isLoading.set(false);

        if (data.category){
          this.loadProduct(data.category);
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
    this.http
      .get<Product[]>(`https://fakestoreapi.com/products/category/${category}`)
      .subscribe({
        next: (items) => {
          // Exclude current item and take the first 4 items
          const filtered = items
            .filter((item) => String(item.id) !== String(currentId))
            .slice(0, 4);
          this.relatedProducts.set(filtered);
        },
        error: () => this.relatedProducts.set([])
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
