import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { Login } from './pages/login/login';
import { ProductListComponent } from './components/product-list/product-list';
import { CartComponent } from './components/cart/cart';
import { Register } from './pages/register/register';
import { Contacto } from './pages/contacto/contacto';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: Login },
  { path: 'category/:type', component: ProductListComponent },
  { path: 'cart', component: CartComponent },
  { path: 'contacto',  component: Contacto },
  { path: 'register', component: Register },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password')
        .then(c => c.ForgotPassword)
  },
  {
    path: 'reset-password/:token',
    loadComponent: () =>
      import('./pages/reset-password/reset-password')
        .then(c => c.ResetPassword)
  },
  { path: '**', redirectTo: '' }
];
