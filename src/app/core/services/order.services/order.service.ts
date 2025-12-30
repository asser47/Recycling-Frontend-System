import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../../models/orders/order.model';
import { Observable } from 'rxjs';
import { API_CONFIG, API_ENDPOINTS } from '../../config/api.config';
import { CreateOrderDto, OrderDto, UpdateOrderStatusRequest } from '../../models/orders/order.model';



@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private http = inject(HttpClient);

  // ===== CITIZEN APIs =====

  /** Citizen: Create a new collection request */
  createOrder(dto: CreateOrderDto): Observable<OrderDto> {
    return this.http.post<OrderDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.orders.create}`, dto);
  }

  /** Citizen: Get all their orders */
  getUserOrders(userId: string): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.orders.getByUser(userId)}`);
  }

  /** Get order by ID */
  getOrder(id: string): Observable<OrderDto> {
    return this.http.get<OrderDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.orders.getById(Number(id))}`);
  }

  // ===== COLLECTOR APIs =====

  /** Collector: Get available orders to accept */
  getAvailableOrders(): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.collectorOrders.getAvailable}`);
  }

  /** Collector: Get their assigned orders */
  getCollectorOrders(): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.collectorOrders.getMyOrders}`);
  }

  /** Collector: Accept an order */
  acceptOrder(orderId: number): Observable<any> {
    return this.http.post<any>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.collectorOrders.accept(orderId)}`, {});
  }

  /** Collector: Update order status */
  updateOrderStatus(orderId: number, request: UpdateOrderStatusRequest): Observable<any> {
    return this.http.patch<any>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.collectorOrders.updateStatus(orderId)}`, request);
  }


  getAll() {
    return this.http.get<Order[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.orders.getAll}`);
  }

  getById(id: number) {
    return this.http.get<Order>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.orders.getById(id)}`);
  }

  create(model: Partial<Order>) {
    return this.http.post(`${API_CONFIG.baseUrl}${API_ENDPOINTS.orders.create}`, model);
  }

  update(id: number, model: Partial<Order>) {
    return this.http.put(`${API_CONFIG.baseUrl}${API_ENDPOINTS.orders.update(id)}`, model);
  }

  delete(id: number) {
    return this.http.delete(`${API_CONFIG.baseUrl}${API_ENDPOINTS.orders.delete(id)}`);
  }

  getByUser(userId: string) {
    return this.http.get<Order[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.orders.getByUser(userId)}`);
  }

  getByCollector(collectorId: string) {
    return this.http.get<Order[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.orders.getByCollector(collectorId)}`);
  }

  getByFactory(factoryId: number) {
    return this.http.get<Order[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.orders.getByFactory(factoryId)}`);
  }

  getByStatus(status: string) {
    return this.http.get<Order[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.orders.getByStatus(status)}`);
  }
  complete(id: number) {
  return this.http.post(`${API_CONFIG.baseUrl}${API_ENDPOINTS.orders.complete(id)}`, null);
}
}



