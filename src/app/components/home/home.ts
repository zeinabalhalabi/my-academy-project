import { Component, inject, OnInit, signal } from '@angular/core';

import { IProductCard } from '../../shared/interfaces/product-card';
import { ProductCards } from '../../shared/components/product-cards/product-cards';
import { ProductService } from '../../shared/services/product-service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductCards],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  private productService = inject(ProductService);
  products = signal<IProductCard[]>([]);

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products.set(data.slice(0, 6));
    })
  }
}
