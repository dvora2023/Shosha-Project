import { Routes } from '@angular/router';
import { AllCategory } from './all-category/all-category';
import { ProductsCategory } from './products-category/products-category';
import { Home } from './home/home';
import { Accessories } from './accessories/accessories';
import { About } from './about/about';
import { ProductDetail } from './product-detail/product-detail';
import { AuthComponent } from './auth/auth';
import { CartPage } from './cart-page/cart-page';
import { Checkout } from './checkout/checkout';
import { OrderSuccess } from './order-success/order-success';
import { Profile } from './profile/profile';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'accessories', component: Accessories },
  { path: 'about', component: About },
  { path: 'all-category', component: AllCategory },
  { path: 'products/:id', component: ProductsCategory },
  { path: 'product/:id', component: ProductDetail },
  { path: 'napkins', component: AllCategory },
  { path: 'plates', component: ProductsCategory },
  { path: 'cups', component: ProductsCategory },
  { path: 'cutlery', component: ProductsCategory },
  { path: 'serving-utensils', component: ProductsCategory },
  { path: 'vases', component: ProductsCategory },
  { path: 'napkin-holders', component: ProductsCategory },
  { path: 'auth', component: AuthComponent },
  { path: 'login', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'cart', component: CartPage },
  { path: 'checkout', component: Checkout },
  { path: 'order-success', component: OrderSuccess },
  { path: 'profile', component: Profile },
  { path: '**', component: Home },
];