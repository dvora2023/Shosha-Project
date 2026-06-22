import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Cart } from '../cart';

@Component({
  selector: 'app-cart-page',
  imports: [CommonModule],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css',
})
export class CartPage {
  cartService = inject(Cart);
  private router = inject(Router);

  total = computed(() => this.cartService.getTotal());

  get items() {
    return this.cartService.items;
  }

  increaseQty(productId: string) {
    const item = this.cartService.items().find(x => x.product._id === productId);
    if (item) {
      this.cartService.addToCart(item.product, 1);
    }
  }

  decreaseQty(productId: string) {
    const current = this.cartService.items();
    const item = current.find(x => x.product._id === productId);
    if (!item) return;
    if (item.quantity <= 1) {
      this.cartService.removeItem(productId);
    } else {
      this.cartService.items.set(
        current.map(x =>
          x.product._id === productId ? { ...x, quantity: x.quantity - 1 } : x
        )
      );
    }
  }

  removeItem(productId: string) {
    this.cartService.removeItem(productId);
  }

  clearCart() {
    this.cartService.clear();
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }

  continueShopping() {
    this.router.navigate(['/']);
  }
}