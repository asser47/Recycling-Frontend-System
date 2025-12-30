import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Role } from '../../models/users/role.enum';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private http = inject(HttpClient);

  private API = 'https://localhost:4375/api/auth';

  private TOKEN_KEY = 'token';
  private ROLE_KEY = 'role';

  // ======================
  // API
  // ======================
  login(data: { email: string; password: string }) {
    return this.http.post<{ token: string }>(`${this.API}/login`, data);
  }

  register(data: any) {
    return this.http.post(`${this.API}/register`, data);
  }

  // ======================
  // TOKEN / ROLE
  // ======================
  saveAuth(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);

    const role = this.extractRoleFromToken(token);
    if (role) {
      localStorage.setItem(this.ROLE_KEY, role);
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRole(): Role | null {
    const role = localStorage.getItem(this.ROLE_KEY);
    return role ? (role as Role) : null;
  }

  isLogged(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.clear();
  }

  // ======================
  // JWT Decode
  // ======================
  private extractRoleFromToken(token: string): Role | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role ?? null;
    } catch {
      return null;
    }
  }
}
