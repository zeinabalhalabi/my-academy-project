import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { SignUp } from './components/sign-up/sign-up';
import { Home } from './components/home/home';
import { Cart } from './components/cart/cart';
import { Profile } from './components/profile/profile';
import { ProductDetails } from './components/product-details/product-details';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { Shop } from './components/shop/shop';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full' },
    {path: 'login', component: Login},
    {path: 'sign-up', component: SignUp},
    {path: 'cart', component: Cart },
    {path: 'shop', component: Shop},
    {path: 'profile', component: Profile },
    {path: 'product/:id', component: ProductDetails },
    {path: 'admin-dashboard', component: AdminDashboard },
    {path: 'home', component: Home}
];
