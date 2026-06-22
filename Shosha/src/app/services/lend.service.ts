import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LendService {
  // הגדרת נתיב הבסיס להשאלות
  private url = `${environment.apiUrl}/lend`;

  constructor(private http: HttpClient) {}

  // קבלת רשימת כל ההשאלות
  getLends(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  // הוספת השאלה חדשה
  addLend(lend: any): Observable<any> {
    return this.http.post(this.url, lend);
  }
}