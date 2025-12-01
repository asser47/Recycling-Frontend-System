import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = 'https://localhost:7165/api/Auth';

  // -------------------------
  // Register
  // -------------------------
  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data, {
      responseType: 'text'
    });
  }

  // -------------------------
  // Login
  // -------------------------
  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data, {
      responseType: 'text'  // السيرفر بيرجع token كسلسلة نصية
    });
  }

  // -------------------------
  // Save Token
  // -------------------------
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  // -------------------------
  // Get Token
  // -------------------------
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // -------------------------
  // Check If Logged
  // -------------------------
  isLogged(): boolean {
    return !!localStorage.getItem('token');
  }

  // -------------------------
  // Logout
  // -------------------------
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
