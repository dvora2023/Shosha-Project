import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { CommonModule } from '@angular/common';
import { Subscription, switchMap, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-products-category',
  imports: [CommonModule],
  templateUrl: './products-category.html',
  styleUrl: './products-category.css',
})
export class ProductsCategory implements OnInit, OnDestroy {
  arr = signal<any[]>([]);
  categoryName = signal('');
  loading = signal(true);

  private routeSub?: Subscription;

  constructor(
    private active: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.routeSub = this.active.params
      .pipe(
        switchMap((params) => {
          const categoryId = params['id'];
          this.loading.set(true);
          this.arr.set([]);
          this.categoryName.set('');

          return forkJoin({
            cat: this.categoryService.getCategoryById(categoryId),
            products: this.productService.getProductsByCategory(categoryId),
          }).pipe(
            catchError((err) => {
              console.error('שגיאה בטעינת קטגוריה:', err);
              return of({ cat: { name: '' }, products: [] as any[] });
            })
          );
        })
      )
      .subscribe({
        next: ({ cat, products }) => {
          this.categoryName.set(cat.name);
          this.arr.set(products);
          this.loading.set(false);
        },
      });
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
  }

  goToProduct(id: string) {
    this.router.navigate(['/product', id]);
  }
}
