import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reward } from '../models/reward.model';

@Injectable({
  providedIn: 'root'
})
export class RewardService {

  private http = inject(HttpClient);
  private baseUrl = 'https://localhost:4375/api/Reward';

  // ================= CRUD =================

  getAll(): Observable<Reward[]> {
    return this.http.get<Reward[]>(this.baseUrl);
  }

  getById(id: number): Observable<Reward> {
    return this.http.get<Reward>(`${this.baseUrl}/${id}`);
  }

  create(reward: FormData): Observable<any> {
    return this.http.post(this.baseUrl, reward);
  }

update(id: number, data: FormData) {
  return this.http.put(`${this.baseUrl}/${id}`, data);
}



  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // ================= Extra Features =================

  getLowStock(): Observable<Reward[]> {
    return this.http.get<Reward[]>(`${this.baseUrl}/low-stock`);
  }

  getStats(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}/stats`);
  }

  updateStock(id: number, amount: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/stock`, { amount });
  }

  getPopular(): Observable<Reward[]> {
    return this.http.get<Reward[]>(`${this.baseUrl}/popular`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/categories`);
  }
}
