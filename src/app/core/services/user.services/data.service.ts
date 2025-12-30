import { Injectable, signal, computed } from '@angular/core';
import { OrderDto, RequestStatus } from '../../models/orders/order.model';

/* =======================
   Interfaces
======================= */

export interface User {
  id: string | number;
  name: string;
  email: string;
  points: number;
  roles?: string[];
  currentRole?: string;
  totalCollections?: number;
}

export interface PointHistory {
  id: number;
  action: string;
  points: number;
  date: string;
  type: 'earned' | 'redeemed' | 'refunded';
}

/* =======================
   Service
======================= */

@Injectable({ providedIn: 'root' })
export class DataService {

  /* =======================
     STATE
  ======================= */

  private readonly STORAGE_KEY = 'current_user';

  private _currentUser = signal<User>(this.loadUser());
  readonly currentUser = this._currentUser.asReadonly();

  private _orders = signal<OrderDto[]>([]);
  readonly orders = this._orders.asReadonly();

  private _pointHistory = signal<PointHistory[]>([]);
  readonly pointHistory = this._pointHistory.asReadonly();

  /* =======================
     COMPUTED
  ======================= */

  readonly pendingOrders = computed(() =>
    this._orders().filter(o => o.status === 'pending')
  );

  readonly inProgressOrders = computed(() =>
    this._orders().filter(o => o.status === 'in-progress')
  );

  readonly completedOrders = computed(() =>
    this._orders().filter(o => o.status === 'completed')
  );

  readonly totalEarnedPoints = computed(() =>
    this._pointHistory()
      .filter(h => h.type === 'earned')
      .reduce((sum, h) => sum + h.points, 0)
  );

  /* =======================
     USER METHODS
  ======================= */

  setCurrentUser(user: User): void {
    this._currentUser.set(user);
    this.saveUser(user);
  }

  updateUser(updates: Partial<User>): void {
    this._currentUser.update(user => {
      const updated = { ...user, ...updates };
      this.saveUser(updated);
      return updated;
    });
  }

  /* =======================
     POINTS METHODS
  ======================= */

  addPoints(points: number, reason: string): void {
    this.updateUser({ points: this.currentUser().points + points });
    this.addHistory('earned', points, reason);
  }

  redeemPoints(points: number, reason: string): boolean {
    if (this.currentUser().points < points) return false;

    this.updateUser({ points: this.currentUser().points - points });
    this.addHistory('redeemed', points, reason);
    return true;
  }

  refundPoints(points: number, reason: string): void {
    this.updateUser({ points: this.currentUser().points + points });
    this.addHistory('refunded', points, reason);
  }

  /* =======================
     ORDERS METHODS
  ======================= */

  setOrders(orders: OrderDto[]): void {
    this._orders.set(orders);
  }

  updateOrderStatus(orderId: number, status: RequestStatus): void {
    this._orders.update(orders =>
      orders.map(o =>
        o.id === orderId ? { ...o, status } : o
      )
    );
  }

  /* =======================
     HISTORY
  ======================= */

  private addHistory(
    type: PointHistory['type'],
    points: number,
    action: string
  ): void {
    const entry: PointHistory = {
      id: Date.now(),
      action,
      points,
      type,
      date: new Date().toISOString().split('T')[0]
    };

    this._pointHistory.update(h => [entry, ...h]);
  }

  /* =======================
     LOCAL STORAGE
  ======================= */

  private loadUser(): User {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw
      ? JSON.parse(raw)
      : {
          id: 1,
          name: 'Guest',
          email: '',
          points: 0
        };
  }

  private saveUser(user: User): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  // ===========================
// Collector / Orders Methods
// ===========================

getRequestsByCollectorId(collectorId: string | number) {
  return this._orders().filter(
    (r: OrderDto) => r.collectorId === collectorId
  );
}

acceptRequestForRoute(
  requestId: string | number,
  collectorId: string | number,
  estimatedArrivalTime: string,
  routeOrder: number
): void {
  this._orders.update(orders =>
    orders.map((r: OrderDto) =>
      r.id === requestId
        ? {
            ...r,
            status: 'in-progress',
            collectorId: String(collectorId),
            estimatedArrivalTime,
            routeOrder
          }
        : r
    )
  );
}

}
