import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Role } from '../../models/users/role.enum';
import { jwtDecode } from 'jwt-decode';
import { signal, computed } from '@angular/core';

interface JwtPayload {
  role?: string | string[];
  roles?: string | string[];
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string | string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
private _token = signal<string | null>(
  localStorage.getItem('token')
);

private _role = signal<Role | null>(
  localStorage.getItem('role') as Role | null
);
isLoggedIn = computed(() => !!this._token() && !!this._role());
roleSignal = computed(() => this._role());
  private apiUrl = 'https://localhost:4375/api/Auth';

  // ===========================
  // AUTH API
  // ===========================

login(data: any) {
  return this.http.post<{ token: string }>(this.apiUrl + '/login', data);
}


register(data: any) {
  return this.http.post(
    `${this.apiUrl}/register`,
    data,
    { responseType: 'text' } // 👈 مهم
  );
}


forgotPassword(email: string) {
  return this.http.post(
    `${this.apiUrl}/forgot-password`,
    { email },
    { responseType: 'text' } // 👈 الحل
  );
}


resetPassword(data: any) {
  return this.http.post(
    `${this.apiUrl}/reset-password`,
    data,
    { responseType: 'text' } // 👈 مهم جدًا
  );
}


confirmEmail(email: string, token: string) {
  const params = new HttpParams()
    .set('email', email)
    .set('token', token);

  return this.http.get(
    `${this.apiUrl}/confirm-email`,
    { params, responseType: 'text' }
  );
}


  // ===========================
  // AUTH STATE
  // ===========================


  saveAuth(token: string) {
    localStorage.setItem('token', token);

    const decoded = jwtDecode<JwtPayload>(token);

    const rawRole =
      decoded.role ??
      decoded.roles ??
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
      null;

    const role = Array.isArray(rawRole) ? rawRole[0] : rawRole;

    if (!role) {
      console.error('ROLE NOT FOUND IN TOKEN');
      return;
    }

    // normalize
    const normalizedRole =
      role.toString().toLowerCase() === 'admin' ? Role.Admin :
      role.toString().toLowerCase() === 'user' ? Role.User :
      role.toString().toLowerCase() === 'collector' ? Role.Collector :
      null;

    if (!normalizedRole) {
      console.error('INVALID ROLE:', role);
      return;
    }
  this._token.set(token);
  this._role.set(normalizedRole);
    localStorage.setItem('role', normalizedRole);
    console.log('ROLE FROM TOKEN:', normalizedRole);
  }

getToken(): string | null {
  return localStorage.getItem('token');
}



  getRole(): Role | null {
    return localStorage.getItem('role') as Role | null;
  }

isLogged(): boolean {
  const token = this.getToken();
  const role = this.getRole();

  return !!token && !!role;
}



logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
    // ✅ notify UI
  this._token.set(null);
  this._role.set(null);
}
getUserIdFromToken(): string | null {
  const token = this.getToken();
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);

    // ASP.NET Identity غالبًا
    return (
      decoded?.nameid ||
      decoded?.sub ||
      decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
      null
    );
  } catch (e) {
    console.error('Invalid token', e);
    return null;
  }
}

}
