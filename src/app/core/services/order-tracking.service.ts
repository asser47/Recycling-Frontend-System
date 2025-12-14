import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../config/api.config.service';
import {
  Order,
  OrderStatus,
  OrderMaterial
} from '../models/order-tracking.model';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderTrackingService {
  private http = inject(HttpClient);
  private apiConfig = inject(ApiConfigService);

  // Signals for state management
  private _myOrders = signal<Order[]>([]);
  myOrders = this._myOrders.asReadonly();

  private _isLoading = signal(false);
  isLoading = this._isLoading.asReadonly();

  private _error = signal<string | null>(null);
  error = this._error.asReadonly();

  // Computed
  pendingOrders = computed(() =>
    this._myOrders().filter(o => o.status === OrderStatus.PENDING)
  );

  acceptedOrders = computed(() =>
    this._myOrders().filter(o => o.status === OrderStatus.ACCEPTED)
  );

  completedOrders = computed(() =>
    this._myOrders().filter(o => o.status === OrderStatus.COMPLETED)
  );

  /**
   * Citizen: Create a new collection request
   */
  createOrder(materials: OrderMaterial[], notes?: string) {
    this._isLoading.set(true);
    this._error.set(null);

    const payload = {
      materials,
      notes,
      status: OrderStatus.PENDING
    };

    return this.http.post<Order>(
      `${this.apiConfig.apiUrl}/Order`,
      payload
    ).pipe(
      tap((order) => {
        this._myOrders.update(orders => [...orders, order]);
        this._isLoading.set(false);
      }),
      catchError((err) => {
        console.error('Failed to create order:', err);
        this._error.set('Failed to create order');
        this._isLoading.set(false);
        return of(null);
      })
    );
  }

  /**
   * Get all orders for current user
   * (Citizen: their orders, Collector: assigned orders, Admin: received orders)
   */
  getMyOrders() {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.get<Order[]>(
      `${this.apiConfig.apiUrl}/Order`
    ).pipe(
      tap((orders) => {
        this._myOrders.set(orders);
        this._isLoading.set(false);
      }),
      catchError((err) => {
        console.error('Failed to fetch orders:', err);
        this._error.set('Failed to load orders');
        this._isLoading.set(false);
        return of(null);
      })
    );
  }

  /**
   * Get specific order details
   */
  getOrderById(orderId: string) {
    return this.http.get<Order>(
      `${this.apiConfig.apiUrl}/Order/${orderId}`
    ).pipe(
      catchError((err) => {
        console.error('Failed to fetch order:', err);
        this._error.set('Failed to load order details');
        return of(null);
      })
    );
  }

  /**
   * Collector: Accept a collection request
   */
  acceptOrder(orderId: string) {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.put<Order>(
      `${this.apiConfig.apiUrl}/Order/${orderId}/accept`,
      {}
    ).pipe(
      tap((order) => {
        this.updateOrderInList(order);
        this._isLoading.set(false);
      }),
      catchError((err) => {
        console.error('Failed to accept order:', err);
        this._error.set('Failed to accept order');
        this._isLoading.set(false);
        return of(null);
      })
    );
  }

  /**
   * Collector: Mark order as collected (picked up from citizen)
   */
  markAsCollected(orderId: string, collectorNotes?: string) {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.put<Order>(
      `${this.apiConfig.apiUrl}/Order/${orderId}/collected`,
      { collectorNotes }
    ).pipe(
      tap((order) => {
        this.updateOrderInList(order);
        this._isLoading.set(false);
      }),
      catchError((err) => {
        console.error('Failed to mark order as collected:', err);
        this._error.set('Failed to update order');
        this._isLoading.set(false);
        return of(null);
      })
    );
  }

  /**
   * Collector: Transfer order to admin
   */
  transferToAdmin(orderId: string, collectorNotes?: string) {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.put<Order>(
      `${this.apiConfig.apiUrl}/Order/${orderId}/transfer`,
      { collectorNotes }
    ).pipe(
      tap((order) => {
        this.updateOrderInList(order);
        this._isLoading.set(false);
      }),
      catchError((err) => {
        console.error('Failed to transfer order:', err);
        this._error.set('Failed to transfer order');
        this._isLoading.set(false);
        return of(null);
      })
    );
  }

  /**
   * Admin: Receive and complete order
   */
  completeOrder(orderId: string, adminNotes?: string) {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.put<Order>(
      `${this.apiConfig.apiUrl}/Order/${orderId}/complete`,
      { adminNotes }
    ).pipe(
      tap((order) => {
        this.updateOrderInList(order);
        this._isLoading.set(false);
      }),
      catchError((err) => {
        console.error('Failed to complete order:', err);
        this._error.set('Failed to complete order');
        this._isLoading.set(false);
        return of(null);
      })
    );
  }

  /**
   * Cancel an order
   */
  cancelOrder(orderId: string, reason?: string) {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.put<Order>(
      `${this.apiConfig.apiUrl}/Order/${orderId}/cancel`,
      { reason }
    ).pipe(
      tap((order) => {
        this.updateOrderInList(order);
        this._isLoading.set(false);
      }),
      catchError((err) => {
        console.error('Failed to cancel order:', err);
        this._error.set('Failed to cancel order');
        this._isLoading.set(false);
        return of(null);
      })
    );
  }

  /**
   * Get status display text
   */
  getStatusLabel(status: OrderStatus): string {
    const labels: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: 'Waiting for Collector',
      [OrderStatus.ACCEPTED]: 'Collector Accepted - On the way',
      [OrderStatus.IN_PROGRESS]: 'In Progress',
      [OrderStatus.COLLECTED]: 'Items Collected',
      [OrderStatus.TRANSFERRED]: 'Transferred to Admin',
      [OrderStatus.COMPLETED]: 'Completed',
      [OrderStatus.CANCELLED]: 'Cancelled'
    };
    return labels[status] || status;
  }

  /**
   * Get status color for UI
   */
  getStatusColor(status: OrderStatus): string {
    const colors: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: 'bg-yellow-500',
      [OrderStatus.ACCEPTED]: 'bg-blue-500',
      [OrderStatus.IN_PROGRESS]: 'bg-blue-600',
      [OrderStatus.COLLECTED]: 'bg-green-500',
      [OrderStatus.TRANSFERRED]: 'bg-purple-500',
      [OrderStatus.COMPLETED]: 'bg-green-600',
      [OrderStatus.CANCELLED]: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  }

  /**
   * Helper: Update order in list
   */
  private updateOrderInList(updatedOrder: Order): void {
    this._myOrders.update(orders =>
      orders.map(o => o.id === updatedOrder.id ? updatedOrder : o)
    );
  }

  /**
   * Clear error
   */
  clearError(): void {
    this._error.set(null);
  }
}
