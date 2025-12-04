import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = 'https://localhost:4375/api/Auth';

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data, { responseType: 'text' });
  }

  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data, { responseType: 'text' });
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email }, { responseType: 'text' });
  }

  resetPassword(data: any) {
    return this.http.post(`${this.apiUrl}/reset-password`, data, { responseType: 'text' });
  }

  confirmEmail(email: string, token: string) {
    return this.http.get(
      `${this.apiUrl}/confirm-email?email=${email}&token=${token}`,
      { responseType: 'text' }
    );
  }

  // ===========================
  // TOKEN
  // ===========================

  saveToken(token: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', 'Admin'); // مؤقتًا
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLogged() {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  getRole(): string {
    return localStorage.getItem('role') || '';
  }
}
