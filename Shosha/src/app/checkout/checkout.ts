import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Cart } from '../cart';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  cartService = inject(Cart);
  router = inject(Router);
  fb = inject(FormBuilder);

  total = computed(() => this.cartService.getTotal());
  submitted = false;

  form = this.fb.group({
    firstName:  ['', Validators.required],
    lastName:   ['', Validators.required],
    phone:      ['', [Validators.required, Validators.pattern(/^\d{9,10}$/)]],
    email:      ['', [Validators.required, Validators.email]],
    address:    ['', Validators.required],
    city:       ['', Validators.required],
    zipCode:    [''],
    apartment:  [''],
    notes:      [''],
    cardNumber: ['', [Validators.required, Validators.pattern(/^\d{13,16}$/)]],
    cardName:   ['', Validators.required],
    cardId:     ['', Validators.required],
    expMonth:   ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])$/)]],
    expYear:    ['', [Validators.required, Validators.pattern(/^\d{2}$/)]],
    cvv:        ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
    agreeTerms: [false, Validators.requiredTrue],
  });

  get f() { return this.form.controls; }

  submitOrder() {
    this.submitted = true;

    // דיאגנוסטיקה - לראות מה לא עובר
    Object.entries(this.form.controls).forEach(([key, control]) => {
      if (control.invalid) {
        console.log(`❌ ${key}:`, control.errors);
      }
    });

    if (this.form.invalid) return;
    this.cartService.clear();
    this.router.navigate(['/order-success']);
  }

  backToCart() {
    this.router.navigate(['/cart']);
  }
}