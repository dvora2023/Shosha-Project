import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private url = `${environment.apiUrl}/user`;
  
  // Signal לשמירת המשתמש המחובר - נגיש מכל מקום
  currentUser = signal<User | null>(this.loadFromStorage());

  constructor(private http: HttpClient, private router: Router) {}

  private loadFromStorage(): User | null {
    const stored = localStorage.getItem('loggedUser');
    return stored ? JSON.parse(stored) : null;
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.url}/${id}`);
  }

  addUser(user: any): Observable<User> {
    return this.http.post<User>(this.url, user);
  }

  updateUser(id: string, user: any): Observable<User> {
    return this.http.put<User>(`${this.url}/${id}`, user).pipe(
      tap((updated) => {
        // אם עדכנו את המשתמש המחובר - עדכן גם את ה-signal
        if (this.currentUser()?._id === id) {
          this.currentUser.set(updated);
          localStorage.setItem('loggedUser', JSON.stringify(updated));
        }
      })
    );
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  loginUser(credentials: { mail: string; password: string }): Observable<User> {
    return this.http.post<User>(`${this.url}/login`, credentials).pipe(
      tap((user) => {
        this.currentUser.set(user);
        localStorage.setItem('loggedUser', JSON.stringify(user));
      })
    );
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('loggedUser');
    this.router.navigate(['/auth']);
  }

  freezeUser(id: string): Observable<User> {
    return this.http.post<User>(`${this.url}/freeze/${id}`, {});
  }

  uploadPhoto(userId: string, file: File): Observable<User> {
    const formData = new FormData();
    formData.append('photo', file);
    return this.http.post<User>(`${this.url}/upload-photo/${userId}`, formData).pipe(
      tap((updated) => {
        this.currentUser.set(updated);
        localStorage.setItem('loggedUser', JSON.stringify(updated));
      })
    );
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }
}