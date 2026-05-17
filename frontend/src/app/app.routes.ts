import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/login/login';
import { ProductListComponent } from './components/product-list/product-list';
import { CartComponent } from './components/cart/cart';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'category/:type', component: ProductListComponent },
  { path: 'cart', component: CartComponent },
  { path: '**', redirectTo: '' }
];
