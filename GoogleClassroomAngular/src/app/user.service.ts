import { Injectable } from '@angular/core';
import { User } from './models/user';
import { BehaviorSubject, EMPTY, Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private baseUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) { }

  // Fetch current user info from backend using token stored in localStorage
  loadCurrentUser(): Observable<User> {
    const token = localStorage.getItem('token');
    if (!token) {
      // Return an empty observable that completes immediately
      return EMPTY;
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<User>(`${this.baseUrl}/me`, { headers }).pipe(
      tap((user) => {
        this.currentUserSubject.next(user);
      })
    );
  }

  // loadCurrentUser(): Observable<User> {
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     throw new Error('No token found');
  //   }
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${token}`,
  //   });
  //   return this.http.get<User>(`${this.baseUrl}/me`, { headers }).pipe(
  //     tap((user) => {
  //       this.currentUserSubject.next(user);
  //     })
  //   );
  // }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Optional: clear user on logout
  clearUser() {
    this.currentUserSubject.next(null);
  }
}
