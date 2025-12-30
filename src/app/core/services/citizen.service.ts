import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationUser } from '../models/application-user.model';
import { ApplicationUserDto, UpdateUserDto } from '../models/dtos.model';
import { API_CONFIG, API_ENDPOINTS } from '@core/config/api.config';

@Injectable({ providedIn: 'root' })
export class CitizenService {

  private http = inject(HttpClient);

  getAll(): Observable<ApplicationUser[]> {
    return this.http.get<ApplicationUser[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.users.getAll}`);
  }

  getById(id: string): Observable<ApplicationUser> {
    return this.http.get<ApplicationUser>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.users.getById(id)}`);
  }

  // ===== CITIZEN: Profile Management =====

  /** Get citizen's profile */
  getProfile(): Observable<ApplicationUserDto> {
    return this.http.get<ApplicationUserDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.users.profile}`);
  }

  /** Update citizen's profile */
  updateProfile(dto: UpdateUserDto): Observable<any> {
    return this.http.put<any>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.users.update}`, dto);
  }

  /** Get user by ID */
  getUserById(id: string): Observable<ApplicationUserDto> {
    return this.http.get<ApplicationUserDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.users.getById(id)}`);
  }

  /** Update user (by ID) */
  updateUser(id: string, dto: UpdateUserDto): Observable<any> {
    return this.http.put<any>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.users.getById(id)}`, dto);
  }

  // ===== CITIZEN: Points Management =====

  /** Get citizen's points */
getPoints(): Observable<{ points: number }> {
  return this.http.get<{ points: number }>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.users.getPoints}`);
}


  // ===== ADMIN: User Management =====

  /** Admin: Get all users */
  getAllUsers(): Observable<ApplicationUserDto[]> {
    return this.http.get<ApplicationUserDto[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.users.getAll}`);
  }
}
