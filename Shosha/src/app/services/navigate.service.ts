import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category } from '../models/category.model';

export interface NavChild {
  label: string;
  link: string;
}

export interface NavItem {

  name: string | null;
//   icon?: string;
//   link: string;
//   exact?: boolean;
  children: NavChild[];
}

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private apiUrl = `${environment.apiUrl}/category`;

  constructor(private http: HttpClient) {}

  getNavItems(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  
}