import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order.model';
import { Observable } from 'rxjs';
import { CreateOrderDto, OrderDto, UpdateOrderStatusRequest } from '../models/order.model';



@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private http = inject(HttpClient);
  private base = 'https://localhost:4375/api/Order';
  private apiUrl = 'https://localhost:4375/api';

  // ===== CITIZEN APIs =====

  /** Citizen: Create a new collection request */
  createOrder(dto: CreateOrderDto): Observable<OrderDto> {
    return this.http.post<OrderDto>(`${this.apiUrl}/Order`, dto);
  }

  /** Citizen: Get all their orders */
  getUserOrders(userId: string): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(`${this.apiUrl}/Order/user/${userId}`);
  }

  /** Get order by ID */
  getOrder(id: string): Observable<OrderDto> {
    return this.http.get<OrderDto>(`${this.apiUrl}/Order/${id}`);
  }

  // ===== COLLECTOR APIs =====

  /** Collector: Get available orders to accept */
  getAvailableOrders(): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(`${this.apiUrl}/collector/orders/available`);
  }

  /** Collector: Get their assigned orders */
  getCollectorOrders(): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(`${this.apiUrl}/collector/orders/my-orders`);
  }

  /** Collector: Accept an order */
  acceptOrder(orderId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/collector/orders/${orderId}/accept`, {});
  }

  /** Collector: Update order status */
  updateOrderStatus(orderId: number, request: UpdateOrderStatusRequest): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/collector/orders/${orderId}/status`, request);
  }


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
  complete(id: number) {
  return this.http.post(`${this.base}/${id}/complete`, null);
}
}



