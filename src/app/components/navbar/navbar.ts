import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../shared/services/cart-service';

export interface UserProfile {
  username: string;
  email: string;
  address: string;
}
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  private router = inject(Router);
  private cartService = inject(CartService);

  cartItemCount = computed(() =>
    this.cartService.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );
  //state signals
  isSearchOpen = signal<boolean>(false);
  isProfileMenuOpen = signal<boolean>(false);
  searchQuery = signal<string>('');

  currentUser = signal<UserProfile | null>(null);

  toggleSearch(): void {
    this.isSearchOpen.update(val => !val);
    if (!this.isSearchOpen()) {
      this.searchQuery.set('');
    }
  }
  onSearchInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery.set(inputElement.value);
  }
  onSearchSubmit(event: Event): void {
    event.preventDefault(); // Prevents default page refresh
    const query = this.searchQuery().trim();
    if (query) {
      this.router.navigate(['/products'], { queryParams: { search: query } });
      this.isSearchOpen.set(false);
      this.searchQuery.set('');
    }
  }

  handleProfileClick(): void {
    const user = this.currentUser();
    if (user) {
      this.isProfileMenuOpen.update(val => !val);
    } else {
      this.router.navigate(['/login']);
    }
  }

  signOut(): void {
    this.currentUser.set(null);
    this.isProfileMenuOpen.set(false);
    this.router.navigate(['/login']);
  }
  
}