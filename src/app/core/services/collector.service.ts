import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG, API_ENDPOINTS } from '../config/api.config';
import { Collector } from '../models/collector.model';
import { HireCollectorDto } from '../models/HireCollectorDto.model';
import { ApplicationUserDto } from '../models/dtos.model';


@Injectable({ providedIn: 'root' })
export class CollectorService {

  private http = inject(HttpClient);

  getAll(): Observable<Collector[]> {
    return this.http.get<Collector[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.collectors.getAll}`);
  }

   getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.orders.getAll}`);
  }

  getMyOrders(): Observable<Collector[]> {
    return this.http.get<Collector[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.collectors.getMyOrders}`);
  }

  getAvailableOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.collectors.getAvailableOrders}`);
  }

  getById(id: string): Observable<Collector> {
    return this.http.get<Collector>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.collectors.getById(id)}`);
  }

  hireCollector(data: HireCollectorDto) {
    return this.http.post(`${API_CONFIG.baseUrl}${API_ENDPOINTS.collectors.hire}`, data);
  }

  fireCollector(id: string) {
    return this.http.delete(`${API_CONFIG.baseUrl}${API_ENDPOINTS.collectors.fire(id)}`);
  }
  // ===== COLLECTOR: View Own Profile =====

  /** Get current collector's profile */
  getMyProfile(): Observable<ApplicationUserDto> {
    return this.http.get<ApplicationUserDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.users.profile}`);
  }

  acceptOrder(orderId: number): Observable<any> {
    return this.http.post<any>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.collectorOrders.accept(orderId)}`, {});
  }

  changeStatus(orderId: number, status: string): Observable<any> {
    return this.http.patch<any>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.collectorOrders.updateStatus(orderId)}`, {
  newStatus: status
    });
  }
}


