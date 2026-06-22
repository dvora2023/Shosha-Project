import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AboutService {
  private url = `${environment.apiUrl}/about`;

  constructor(private http: HttpClient) {}

  getAbout(): Observable<any> {
    return this.http.get<any>(this.url);
  }
}