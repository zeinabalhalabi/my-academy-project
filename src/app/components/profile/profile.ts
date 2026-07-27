import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, IUser } from '../../core/auth/auth-service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
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
        console.log('2. Data received from backend:', data);
        this.user.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('2. Error occurred:', err);
        this.isLoading.set(false);
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
  }
}