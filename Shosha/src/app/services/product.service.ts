import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private url = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  // ← חדש
  getProductsByCategory(categoryId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/by-category/${categoryId}`);
  }

  addProduct(product: any): Observable<any> {
    return this.http.post(this.url, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}