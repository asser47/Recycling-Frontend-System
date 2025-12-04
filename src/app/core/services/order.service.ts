import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private http = inject(HttpClient);
  private base = 'https://localhost:4375/api/Order';

  getAll() {
    return this.http.get<Order[]>(this.base);
  }

  getById(id: number) {
    return this.http.get<Order>(`${this.base}/${id}`);
  }

  create(model: Partial<Order>) {
    return this.http.post(this.base, model);
  }

  update(id: number, model: Partial<Order>) {
    return this.http.put(`${this.base}/${id}`, model);
  }

  delete(id: number) {
    return this.http.delete(`${this.base}/${id}`);
  }

  getByUser(userId: string) {
    return this.http.get<Order[]>(`${this.base}/user/${userId}`);
  }

  getByCollector(collectorId: string) {
    return this.http.get<Order[]>(`${this.base}/collector/${collectorId}`);
  }

  getByFactory(factoryId: number) {
    return this.http.get<Order[]>(`${this.base}/factory/${factoryId}`);
  }

  getByStatus(status: string) {
    return this.http.get<Order[]>(`${this.base}/status/${status}`);
  }
}
