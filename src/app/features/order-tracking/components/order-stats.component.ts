import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order, OrderStatus } from '../../../core/models/order-tracking.model';
import { OrderTrackingService } from '../../../core/services/order-tracking.service';

@Component({
  selector: 'app-order-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <!-- Total Orders -->
      <div class="card-lg p-4 text-center hover:bg-muted transition-colors">
        <p class="text-3xl font-bold text-primary mb-1">{{ orders.length }}</p>
        <p class="text-sm text-muted-foreground">Total Orders</p>
      </div>

      <!-- Pending Orders -->
      <div class="card-lg p-4 text-center hover:bg-yellow-500/10 transition-colors border-b-2 border-yellow-500">
        <p class="text-3xl font-bold text-yellow-600 mb-1">{{ getPendingCount() }}</p>
        <p class="text-sm text-muted-foreground">Pending</p>
      </div>

      <!-- In Progress Orders -->
      <div class="card-lg p-4 text-center hover:bg-blue-500/10 transition-colors border-b-2 border-blue-500">
        <p class="text-3xl font-bold text-blue-600 mb-1">{{ getInProgressCount() }}</p>
        <p class="text-sm text-muted-foreground">In Progress</p>
      </div>

      <!-- Completed Orders -->
      <div class="card-lg p-4 text-center hover:bg-green-500/10 transition-colors border-b-2 border-green-600">
        <p class="text-3xl font-bold text-green-600 mb-1">{{ getCompletedCount() }}</p>
        <p class="text-sm text-muted-foreground">Completed</p>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="card-lg p-4 mt-4">
      <div class="flex justify-between items-center mb-3">
        <h3 class="font-bold text-foreground">Progress</h3>
        <p class="text-sm text-muted-foreground">{{ getCompletedCount() }} of {{ orders.length }} completed</p>
      </div>
      <div class="w-full bg-muted rounded-full h-3 overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all"
          [style.width.%]="getProgressPercentage()"
        ></div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderStatsComponent {
  @Input() orders: Order[] = [];

  trackingService = inject(OrderTrackingService);
  OrderStatus = OrderStatus;

  /**
   * Get count of pending orders
   */
  getPendingCount(): number {
    return this.orders.filter(o => o.status === OrderStatus.PENDING).length;
  }

  /**
   * Get count of in-progress orders
   */
  getInProgressCount(): number {
    return this.orders.filter(o =>
      o.status === OrderStatus.ACCEPTED ||
      o.status === OrderStatus.IN_PROGRESS ||
      o.status === OrderStatus.COLLECTED ||
      o.status === OrderStatus.TRANSFERRED
    ).length;
  }

  /**
   * Get count of completed orders
   */
  getCompletedCount(): number {
    return this.orders.filter(o => o.status === OrderStatus.COMPLETED).length;
  }

  /**
   * Get progress percentage
   */
  getProgressPercentage(): number {
    if (this.orders.length === 0) return 0;
    return (this.getCompletedCount() / this.orders.length) * 100;
  }
}
