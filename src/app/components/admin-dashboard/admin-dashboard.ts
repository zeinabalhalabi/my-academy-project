import { Component } from '@angular/core';
import { ProductsList } from '../products-list/products-list';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [ProductsList],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {}
