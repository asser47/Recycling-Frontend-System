// core/services/admin-user.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../../config/api.config';
import { ApplicationUser } from '../../models/users/application-user.model';
import { Order } from '../../models/orders/order.model';

@Injectable({ providedIn: 'root' })
export class AdminUserService {

  private http = inject(HttpClient);

  getAll() {
    return this.http.get<ApplicationUser[]>(`${API_CONFIG.baseUrl}/User`);
  }

  getById(id: string) {
    return this.http.get<ApplicationUser>(`${API_CONFIG.baseUrl}/User/${id}`);
  }

  update(id: string, data: Partial<ApplicationUser>) {
    return this.http.put(`${API_CONFIG.baseUrl}/User/${id}`, data);
  }

  getOrders(userId: string) {
    return this.http.get<Order[]>(`${API_CONFIG.baseUrl}/Order/user/${userId}`);
  }
}
