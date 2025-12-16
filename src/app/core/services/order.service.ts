import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateOrderDto, OrderDto, UpdateOrderStatusRequest, AssignOrderRequest } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private http = inject(HttpClient);
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

  // ===== ADMIN APIs =====

  /** Admin: Get all orders */
  getAllOrders(): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(`${this.apiUrl}/Order`);
  }

  /** Admin: Assign order to collector */
  assignOrder(orderId: number, request: AssignOrderRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/collector/orders/${orderId}/assign`, request);
  }

  /** Admin: Get orders by status */
  getOrdersByStatus(status: string): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(`${this.apiUrl}/Order/status/${status}`);
  }

  /** Admin: Get orders by collector */
  getOrdersByCollector(collectorId: string): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(`${this.apiUrl}/Order/collector/${collectorId}`);
  }

  /** Admin: Get orders by factory */
  getOrdersByFactory(factoryId: number): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(`${this.apiUrl}/Order/factory/${factoryId}`);
  }

  /** Admin: Complete an order */
  completeOrder(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Order/${id}/complete`, {});
  }

  /** Admin: Cancel an order */
  cancelOrder(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Order/${id}/cancel`, {});
  }

  /** Admin: Update an order */
  updateOrder(id: number, dto: OrderDto): Observable<OrderDto> {
    return this.http.put<OrderDto>(`${this.apiUrl}/Order/${id}`, dto);
  }

  /** Admin: Delete an order */
  deleteOrder(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Order/${id}`);
  }
}
