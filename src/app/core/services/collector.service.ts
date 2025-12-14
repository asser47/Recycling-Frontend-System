import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationUserDto, HireCollectorDto } from '../models/dtos.model';

@Injectable({
  providedIn: 'root'
})
export class CollectorService {

  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:4375/api';

  // ===== ADMIN: Manage Collectors =====

  /** Admin: Hire a new collector */
  hireCollector(dto: HireCollectorDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Collector/hire`, dto);
  }

  /** Admin: Get all collectors */
  getAllCollectors(): Observable<ApplicationUserDto[]> {
    return this.http.get<ApplicationUserDto[]>(`${this.apiUrl}/Collector`);
  }

  /** Admin: Get collector details */
  getCollector(id: string): Observable<ApplicationUserDto> {
    return this.http.get<ApplicationUserDto>(`${this.apiUrl}/Collector/${id}`);
  }

  /** Admin: Fire (remove) a collector */
  fireCollector(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Collector/${id}/fire`);
  }

  // ===== COLLECTOR: View Own Profile =====

  /** Get current collector's profile */
  getMyProfile(): Observable<ApplicationUserDto> {
    return this.http.get<ApplicationUserDto>(`${this.apiUrl}/User/profile`);
  }
}
