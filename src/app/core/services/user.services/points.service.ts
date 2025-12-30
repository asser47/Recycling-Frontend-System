import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG, API_ENDPOINTS } from '../../config/api.config';

@Injectable({ providedIn: 'root' })
export class PointsService {

  private http = inject(HttpClient);

  getMyPoints(): Observable<number> {
    return this.http.get<number>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.users.getPoints}`);
  }
}
