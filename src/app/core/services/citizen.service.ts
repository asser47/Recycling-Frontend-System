import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationUserDto, UpdateUserDto } from '../models/dtos.model';

@Injectable({ providedIn: 'root' })
export class CitizenService {

  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:4375/api';

  // ===== CITIZEN: Profile Management =====

  /** Get citizen's profile */
  getProfile(): Observable<ApplicationUserDto> {
    return this.http.get<ApplicationUserDto>(`${this.apiUrl}/User/profile`);
  }

  /** Update citizen's profile */
  updateProfile(dto: UpdateUserDto): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/User/profile`, dto);
  }

  /** Get user by ID */
  getUserById(id: string): Observable<ApplicationUserDto> {
    return this.http.get<ApplicationUserDto>(`${this.apiUrl}/User/${id}`);
  }

  /** Update user (by ID) */
  updateUser(id: string, dto: UpdateUserDto): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/User/${id}`, dto);
  }

  // ===== CITIZEN: Points Management =====

  /** Get citizen's points */
  getPoints(): Observable<{ points: number }> {
    return this.http.get<{ points: number }>(`${this.apiUrl}/User/points`);
  }

  // ===== ADMIN: User Management =====

  /** Admin: Get all users */
  getAllUsers(): Observable<ApplicationUserDto[]> {
    return this.http.get<ApplicationUserDto[]>(`${this.apiUrl}/User`);
  }
}
