import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order, OrderStatus } from '../../../core/models/order-tracking.model';
import { OrderTrackingService } from '../../../core/services/order-tracking.service';

@Component({
  selector: 'app-order-status-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <!-- Current Status -->
      <div class="text-center mb-6">
        <p class="text-sm text-muted-foreground mb-2">Current Status</p>
        <span [class]="'text-lg font-bold px-6 py-2 rounded-lg text-white ' + trackingService.getStatusColor(order.status)">
          {{ trackingService.getStatusLabel(order.status) }}
        </span>
      </div>

      <!-- Timeline -->
      <div class="relative">
        <!-- Vertical line -->
        @if (order.statusHistory.length > 0) {
          <div class="absolute left-4 top-8 bottom-0 w-0.5 bg-border"></div>
        }

        <!-- Timeline items -->
        <div class="space-y-4">
          @for (history of order.statusHistory; track history.changedAt; let last = $last) {
            <div class="relative pl-16">
              <!-- Circle -->
              <div
                [class]="'absolute left-0 top-1 w-9 h-9 rounded-full flex items-center justify-center text-white ' + trackingService.getStatusColor(history.status)"
              >
                <span class="text-sm">✓</span>
              </div>

              <!-- Content -->
              <div class="card-lg p-4">
                <div class="flex justify-between items-start mb-1">
                  <h4 class="font-bold text-foreground">
                    {{ trackingService.getStatusLabel(history.status) }}
                  </h4>
                  <span class="text-xs text-muted-foreground">
                    {{ history.changedAt | date:'medium' }}
                  </span>
                </div>

                <p class="text-sm text-muted-foreground mb-2">
                  by <span class="font-medium">{{ history.changedBy }}</span>
                </p>

                @if (history.remarks) {
                  <p class="text-sm text-foreground bg-muted p-2 rounded">
                    {{ history.remarks }}
                  </p>
                }
              </div>

              <!-- Last item connector -->
              @if (!last) {
                <div class="h-2"></div>
              }
            </div>
          }

          <!-- Empty state -->
          @if (order.statusHistory.length === 0) {
            <p class="text-muted-foreground text-center py-4">No status history</p>
          }
        </div>
      </div>

      <!-- Additional Info -->
      <div class="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-border">
        @if (order.createdAt) {
          <div>
            <p class="text-xs text-muted-foreground mb-1">Created</p>
            <p class="text-sm font-medium text-foreground">{{ order.createdAt | date:'short' }}</p>
          </div>
        }
        @if (order.completedAt) {
          <div>
            <p class="text-xs text-muted-foreground mb-1">Completed</p>
            <p class="text-sm font-medium text-foreground">{{ order.completedAt | date:'short' }}</p>
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderStatusTimelineComponent {
  @Input() order!: Order;

  trackingService = inject(OrderTrackingService);
  OrderStatus = OrderStatus;
}
