import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { Login } from './pages/login/login';
import { ProductListComponent } from './components/product-list/product-list';
import { CartComponent } from './components/cart/cart';
import { Register } from './pages/register/register';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: Login },
  { path: 'category/:type', component: ProductListComponent },
  { path: 'cart', component: CartComponent },
  { path: 'register', component: Register },
  { path: '**', redirectTo: '' }
];
