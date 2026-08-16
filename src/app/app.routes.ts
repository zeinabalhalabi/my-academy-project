import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ProductDetails } from './components/product-details/product-details';
import { Shop } from './components/shop/shop';
import { AuthGuard } from './core/auth/auth-guard';
import { AdminGuard } from './core/auth/admin-guard';


export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full' },
    {path: 'product/:id', component: ProductDetails },
    {path: 'shop', component: Shop},

    {path: 'login', 
        loadComponent: () =>
            import ('./components/login/login')
                .then(m => m.Login) },

    {path: 'sign-up',
        loadComponent: () =>
            import ('./components/sign-up/sign-up')
                .then(m => m.SignUp)},

    {path: 'cart', 
        loadComponent: () =>
            import ('./components/cart/cart')
                .then(m => m.Cart), 
                    canActivate: [AuthGuard]},

    {path: 'checkout', 
        loadComponent: () =>
            import ('./components/checkout/checkout')
                .then(m => m.Checkout),
                    canActivate: [AuthGuard]},

    {path: 'profile', 
        loadComponent: () =>
            import ('./components/profile/profile')
                .then(m => m.Profile), 
                    canActivate: [AuthGuard] },

    {path: 'admin-dashboard',
         loadComponent: () =>
            import ('./components/admin-dashboard/admin-dashboard')
                .then(m => m.AdminDashboard), 
                    canActivate: [AdminGuard]},
    {path: 'admin-dashboard/dashboard',
         loadComponent: () =>
            import ('./components/admin-dashboard/dashboard/dashboard')
                .then(m => m.Dashboard), 
                    canActivate: [AdminGuard]},

    {path: 'home', component: Home}
];
