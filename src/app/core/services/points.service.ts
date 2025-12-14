import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({ providedIn: 'root' })
export class PointsService {

  private url = `${API_CONFIG.baseUrl}/points`;

  constructor(private http: HttpClient) {}

  getUserPoints(userId: number): Observable<any> {
    return this.http.get(`${this.url}/${userId}`);
  }

  addPoints(userId: number, points: number): Observable<any> {
    return this.http.post(`${this.url}/add`, { userId, points });
  }
}
