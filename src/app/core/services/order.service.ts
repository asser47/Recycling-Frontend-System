import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';
import { API_CONFIG } from './api.config';

@Injectable({ providedIn: 'root' })
export class OrderService {

  private url = `${API_CONFIG.baseUrl}/order`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.url);
  }

  // getUserOrders(userId: string): Observable<Order[]> {
  //   return this.http.get<Order[]>(`${this.url}/user/${userId}`);
  // }
}
