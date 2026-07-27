import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductsList } from './components/products-list/products-list';
//import { ProductDetails } from './components/product-details/product-details';
import { AuthService } from './core/auth/auth-service';
import { NavbarComponent } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-academy-project');
  private authService = inject(AuthService);
}
