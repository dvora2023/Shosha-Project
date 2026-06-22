import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Cart } from '../cart';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail implements OnInit, OnDestroy {
  product = signal<any>(null);
  quantity = signal(1);
  added = signal(false);

  private routeSub?: Subscription;

  constructor(
    private active: ActivatedRoute,
    private s: ProductService,
    private cart: Cart,
    private router: Router
  ) {}

  ngOnInit() {
    this.routeSub = this.active.params
      .pipe(
        switchMap((params) => {
          this.product.set(null);
          this.quantity.set(1);
          this.added.set(false);
          return this.s.getProductById(params['id']);
        })
      )
      .subscribe({
        next: (data) => this.product.set(data),
        error: (err) => console.error('שגיאה בטעינת מוצר:', err),
      });
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
  }

  addToCart() {
    const p = this.product();
    if (p && this.quantity() > 0) {
      this.cart.addToCart(p, this.quantity());
      this.added.set(true);
      setTimeout(() => this.added.set(false), 2000);
    }
  }

  goBack() {
    const p = this.product();
    if (p) {
      this.router.navigate(['/products', p.category]);
    }
  }
}
