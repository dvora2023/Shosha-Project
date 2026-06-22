import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-success',
  imports: [],
  templateUrl: './order-success.html',
  styleUrl: './order-success.css',
})
export class OrderSuccess {
  router = inject(Router);

  continueShopping() {
    this.router.navigate(['/']);
  }
}