import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { OrderTrackingService } from '../../core/services/order-tracking.service';
import { AuthService } from '../../core/services/auth.service';
import { Order, OrderStatus } from '../../core/models/order-tracking.model';
import { CitizenOrderCardComponent } from './components/citizen-order-card.component';
import { CollectorOrderCardComponent } from './components/collector-order-card.component';
import { AdminOrderCardComponent } from './components/admin-order-card.component';
import { OrderStatusTimelineComponent } from './components/order-status-timeline.component';
import { OrderStatsComponent } from './components/order-stats.component';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [
    CommonModule,
    CitizenOrderCardComponent,
    CollectorOrderCardComponent,
    AdminOrderCardComponent,
    OrderStatusTimelineComponent,
    OrderStatsComponent
  ],
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderTrackingComponent implements OnInit, OnDestroy {
  private orderService = inject(OrderTrackingService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  private destroy$ = new Subject<void>();

  // State
  selectedOrder: Order | null = null;
  selectedTab: 'all' | 'pending' | 'accepted' | 'completed' = 'all';

  // Signals from service
  myOrders = this.orderService.myOrders;
  pendingOrders = this.orderService.pendingOrders;
  acceptedOrders = this.orderService.acceptedOrders;
  completedOrders = this.orderService.completedOrders;
  isLoading = this.orderService.isLoading;
  error = this.orderService.error;

  // Constants
  OrderStatus = OrderStatus;

  ngOnInit(): void {
    this.loadOrders();

    // Check for order ID in route params
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['id']) {
        this.selectOrder(params['id']);
      }
    });
  }

  /**
   * Load all orders for current user
   */
  loadOrders(): void {
    this.orderService.getMyOrders().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load orders:', err);
        this.cdr.markForCheck();
      }
    });
  }

  /**
   * Get filtered orders based on selected tab
   */
  getFilteredOrders(): Order[] {
    switch (this.selectedTab) {
      case 'pending':
        return this.pendingOrders();
      case 'accepted':
        return this.acceptedOrders();
      case 'completed':
        return this.completedOrders();
      default:
        return this.myOrders();
    }
  }

  /**
   * Select an order to view details
   */
  selectOrder(orderId: string): void {
    const order = this.myOrders().find(o => o.id === orderId);
    if (order) {
      this.selectedOrder = order;
      this.cdr.markForCheck();
    }
  }

  /**
   * Close order details
   */
  closeOrderDetails(): void {
    this.selectedOrder = null;
    this.router.navigate(['/order-tracking']);
    this.cdr.markForCheck();
  }

  /**
   * Get status label
   */
  getStatusLabel(status: OrderStatus): string {
    return this.orderService.getStatusLabel(status);
  }

  /**
   * Get status color
   */
  getStatusColor(status: OrderStatus): string {
    return this.orderService.getStatusColor(status);
  }

  /**
   * Accept order (Collector action)
   */
  acceptOrder(orderId: string): void {
    if (confirm('Are you sure you want to accept this order?')) {
      this.orderService.acceptOrder(orderId).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Failed to accept order:', err);
          this.cdr.markForCheck();
        }
      });
    }
  }

  /**
   * Mark order as collected (Collector action)
   */
  markAsCollected(orderId: string, notes?: string): void {
    if (confirm('Confirm that items have been collected?')) {
      this.orderService.markAsCollected(orderId, notes).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Failed to mark as collected:', err);
          this.cdr.markForCheck();
        }
      });
    }
  }

  /**
   * Transfer order to admin (Collector action)
   */
  transferToAdmin(orderId: string, notes?: string): void {
    if (confirm('Transfer this order to admin?')) {
      this.orderService.transferToAdmin(orderId, notes).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Failed to transfer order:', err);
          this.cdr.markForCheck();
        }
      });
    }
  }

  /**
   * Complete order (Admin action)
   */
  completeOrder(orderId: string, notes?: string): void {
    if (confirm('Mark this order as completed?')) {
      this.orderService.completeOrder(orderId, notes).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Failed to complete order:', err);
          this.cdr.markForCheck();
        }
      });
    }
  }

  /**
   * Cancel order
   */
  cancelOrder(orderId: string, reason?: string): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(orderId, reason).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Failed to cancel order:', err);
          this.cdr.markForCheck();
        }
      });
    }
  }

  /**
   * Get user role for conditional rendering
   */
  getUserRole(): string | null {
    return this.authService.getRole();
  }

  /**
   * Clear error message
   */
  clearError(): void {
    this.orderService.clearError();
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
