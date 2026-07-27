import { Component, OnInit, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Required for @if blocks
import { AuthService, IUser } from '../../core/auth/auth-service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule], // <-- Must be included here
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {
  private authService = inject(AuthService);
  
  user = signal<IUser | undefined>(undefined);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    console.log('1. Profile request starting...');

    this.authService.fetchUserProfile().subscribe({
      next: (data) => {
        // If the request succeeds, this block should run
        console.log('2. Data received from backend:', data);
        
        this.user.set(data);
        this.isLoading.set(false); // <-- This is what hides the loading text!
      },
      error: (err) => {
        // If the request fails, this block should run
        console.error('2. Error occurred:', err);
        
        this.isLoading.set(false); // <-- Hides loading even if there's an error
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
  }
}