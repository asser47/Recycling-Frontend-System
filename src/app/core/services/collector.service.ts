import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Collector } from '../models/collector.model';
import { HireCollectorDto } from '../models/HireCollectorDto.model';
import { ApplicationUserDto } from '../models/dtos.model';


@Injectable({ providedIn: 'root' })
export class CollectorService {

  private http = inject(HttpClient);
  private baseUrl = 'https://localhost:4375/api/Collector';
    private apiUrl = 'https://localhost:4375/api';


  getAll(): Observable<Collector[]> {
    return this.http.get<Collector[]>(this.baseUrl);
  }

   getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/Order');
  }

  getMyOrders(): Observable<Collector[]> {
    return this.http.get<Collector[]>(`${this.baseUrl}/Orders/my-orders`);
  }

  getAvailableOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Orders/available`);
  }

  getById(id: string): Observable<Collector> {
    return this.http.get<Collector>(`${this.baseUrl}/${id}`);
  }

  hireCollector(data: HireCollectorDto) {
    return this.http.post(`${this.baseUrl}/hire`, data);
  }

  fireCollector(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}/fire`);
  }
  // ===== COLLECTOR: View Own Profile =====

  /** Get current collector's profile */
  getMyProfile(): Observable<ApplicationUserDto> {
    return this.http.get<ApplicationUserDto>(`${this.apiUrl}/User/profile`);
  }

  acceptOrder(orderId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/collector/orders/${orderId}/accept`, {});
  }

  changeStatus(orderId: number, status: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/collector/orders/${orderId}/status`, {

  newStatus: status
    });
  }
}


