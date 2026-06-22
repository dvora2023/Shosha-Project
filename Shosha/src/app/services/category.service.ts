import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private url = `${environment.apiUrl}/category`;

  constructor(private http: HttpClient) {}

  private categories$: Observable<any[]> | null = null;


  getCategories(): Observable<any[]> {
    if (!this.categories$) {
      this.categories$ = this.http.get<any[]>(this.url).pipe(shareReplay(1));
    }
    return this.categories$;
  }

  // ← חדש
  getCategoryById(id: string): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }
}