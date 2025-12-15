import { Component, Input, Output, EventEmitter, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Order, OrderStatus } from '../../../core/models/order-tracking.model';
import { OrderTrackingService } from '../../../core/services/order-tracking.service';

@Component({
  selector: 'app-collector-order-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card-lg p-4 border-l-4" [class.border-l-yellow-500]="order.status === OrderStatus.PENDING"
         [class.border-l-blue-500]="order.status === OrderStatus.ACCEPTED"
         [class.border-l-green-500]="order.status === OrderStatus.COLLECTED"
         [class.border-l-purple-500]="order.status === OrderStatus.TRANSFERRED">
      <div class="flex justify-between items-start mb-3">
        <div>
          <h4 class="font-bold text-foreground">Order #{{ order.id.slice(0, 8).toUpperCase() }}</h4>
          <p class="text-xs text-muted-foreground">{{ order.createdAt | date:'short' }}</p>
        </div>
        <span [class]="'text-xs font-bold px-3 py-1 rounded-full text-white ' + trackingService.getStatusColor(order.status)">
          {{ trackingService.getStatusLabel(order.status) }}
        </span>
      </div>

      <div class="grid grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <p class="text-muted-foreground">Items</p>
          <p class="font-bold text-foreground">{{ order.totalQuantity }}</p>
        </div>
        <div>
          <p class="text-muted-foreground">Citizen</p>
          <p class="font-bold text-foreground text-xs">{{ order.citizenName }}</p>
        </div>
      </div>

      <div class="space-y-2">
        @if (order.status === OrderStatus.PENDING) {
          <button
            (click)="accept.emit(order.id)"
            class="w-full btn-primary text-sm py-2"
          >
            Accept Order
          </button>
        }
        @if (order.status === OrderStatus.ACCEPTED) {
          <button
            (click)="markCollected.emit(order.id)"
            class="w-full btn-primary text-sm py-2"
          >
            Mark as Collected
          </button>
        }
        @if (order.status === OrderStatus.COLLECTED) {
          <button
            (click)="transfer.emit(order.id)"
            class="w-full btn-primary text-sm py-2"
          >
            Transfer to Admin
          </button>
        }
        <button
          (click)="viewDetails.emit(order.id)"
          class="w-full btn-outline text-sm py-2"
        >
          View Details
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectorOrderCardComponent {
  @Input() order!: Order;
  @Output() viewDetails = new EventEmitter<string>();
  @Output() accept = new EventEmitter<string>();
  @Output() markCollected = new EventEmitter<string>();
  @Output() transfer = new EventEmitter<string>();

  trackingService = inject(OrderTrackingService);
  OrderStatus = OrderStatus;
}
