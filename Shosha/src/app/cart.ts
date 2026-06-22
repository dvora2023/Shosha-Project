import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Cart {
  items = signal<{ product: any; quantity: number }[]>(this.loadFromStorage());

  totalItems = computed(() =>
    this.items().reduce((sum, x) => sum + x.quantity, 0)
  );

  private loadFromStorage(): { product: any; quantity: number }[] {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  }

  private saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(this.items()));
  }

  addToCart(product: any, quantity: number) {
    const current = this.items();
    const existingIndex = current.findIndex(x => x.product._id === product._id);
    if (existingIndex > -1) {
      const updated = [...current];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + quantity
      };
      this.items.set(updated);
    } else {
      this.items.set([...current, { product, quantity }]);
    }
    this.saveToStorage();
  }

  // ← נוסף: הורדת כמות ב-1 (או הסרה אם כמות = 1)
  decreaseQty(productId: string) {
    const current = this.items();
    const item = current.find(x => x.product._id === productId);
    if (!item) return;

    if (item.quantity <= 1) {
      this.removeItem(productId);
    } else {
      this.items.set(
        current.map(x =>
          x.product._id === productId
            ? { ...x, quantity: x.quantity - 1 }
            : x
        )
      );
      this.saveToStorage();
    }
  }

  getItems() {
    return this.items();
  }

  getTotal() {
    return this.items().reduce((sum, x) => sum + x.product.price * x.quantity, 0);
  }

  removeItem(productId: string) {
    this.items.set(this.items().filter(x => x.product._id !== productId));
    this.saveToStorage();
  }

  clear() {
    this.items.set([]);
    localStorage.removeItem('cart');
  }
}