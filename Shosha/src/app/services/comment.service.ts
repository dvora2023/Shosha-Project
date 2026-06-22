import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CommentService {
  // הגדרת נתיב הבסיס לתגובות
  private url = `${environment.apiUrl}/comment`;

  constructor(private http: HttpClient) {}

  // קבלת כל התגובות עבור מוצר ספציפי
  getComments(productId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${productId}`);
  }

  // הוספת תגובה חדשה
  addComment(comment: any): Observable<any> {
    return this.http.post(this.url, comment);
  }
}