import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterForm } from '../models/register-form';
import { Observable } from 'rxjs';
import { LoginForm } from '../models/login-form';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { UserService } from '../user.service';

export interface DecodedToken {
  sub: string;   // user email
  name: string;
  exp: number;
  iat?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = "http://localhost:8080/auth";
  private tokenKey = 'token';

  constructor(private http: HttpClient, private router: Router, private userService: UserService) { }

  register(registerData: RegisterForm): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, registerData);
  }

  login(loginData: LoginForm): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, loginData);
  }

  storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }


  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Invalid token', error);
      return null;
    }
  }

  isTokenValid(): boolean {
    const decoded = this.getDecodedToken();
    if (!decoded || !decoded.exp) return false;

    const now = Math.floor(Date.now() / 1000);
    return decoded.exp > now;
  }


  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/auth/login']);
  }

  getUserEmail(): string {
    console.log(this.getDecodedToken());

    return this.getDecodedToken()?.sub || 'Unknown email';
  }

  getUserName(): string {
    console.log("user name : " + this.getDecodedToken()?.name);

    return this.getDecodedToken()?.name || 'Unknown username';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
