import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationUser } from '../models/application-user.model';
import { API_CONFIG } from './api.config';

@Injectable({ providedIn: 'root' })
export class CitizenService {

  private url = `${API_CONFIG.baseUrl}/User`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApplicationUser[]> {
    return this.http.get<ApplicationUser[]>(this.url);
  }

  getById(id: string): Observable<ApplicationUser> {
    return this.http.get<ApplicationUser>(`${this.url}/${id}`);
  }
}
