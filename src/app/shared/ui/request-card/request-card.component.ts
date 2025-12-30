import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '../badge/badge.component';
import { ButtonComponent } from '../button/button.component';
import { OrderDto } from '@core/models/orders/order.model';
import { LanguageService } from '@core/services/language.service';

@Component({
  selector: 'app-request-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, BadgeComponent, ButtonComponent],
  template: `
    <div
      [class]="
        'mb-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors ' +
        (clickable ? 'cursor-pointer' : '') +
        ' ' +
        (className || '')
      "
      (click)="clickable && onCardClick.emit(request)"
    >
      <!-- Header: Material Type & Status -->
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1">
          <h3 class="font-medium text-card-foreground mb-1">
            🔄 Order No. {{ request.id }}
          </h3>
          @if (request.userName) {
          <p class="text-sm text-muted-foreground">{{ request.userName }}</p>
          }
        </div>
        <app-badge [variant]="getBadgeVariant(request.status)">
          {{ getStatusText(request.status) }}
        </app-badge>
      </div>

      <!-- Details -->
      <div class="space-y-2 text-sm text-muted-foreground mb-3">
        <!-- Email -->
        @if (request.email) {
        <div class="flex items-center gap-2">
          <span>📧</span>
          <span>{{ request.email }}</span>
        </div>
        }

        <!-- Address -->
        <div class="flex items-center gap-2">
          <span>📍</span>
          <span>
            {{ request.buildingNo + ' building, ' }}
            {{ request.apartment ? request.apartment + 'apt., ' : '' }}

            {{ request.street + ' st ,' }}{{ request.city }}
          </span>
        </div>

        <!-- Quantity -->
        @if (request.quantity) {
        <div class="flex items-center gap-2">
          <span>⚖️</span>
          <span>{{ request.quantity }} kg</span>
        </div>
        }

        <!-- Order Date -->
        @if (request.orderDate) {
        <div class="flex items-center gap-2">
          <span>📅</span>
          <span>{{ formatDate(request.orderDate) }}</span>
        </div>
        }

        <!-- Collector Name (if assigned) -->
        @if (request.collectorName && request.status === 'in-progress') {
        <div class="p-2 bg-primary/10 rounded-md border border-primary/20">
          <div class="flex items-center gap-2">
            <span>🚛</span>
            <div class="text-xs">
              <p class="text-muted-foreground">Collector</p>
              <p class="font-medium text-primary">
                {{ request.collectorName }}
              </p>
            </div>
          </div>
        </div>
        }
      </div>

      <!-- Actions -->
      @if (showActions && request.status === 'pending') {
      <app-button
        variant="default"
        size="sm"
        class="w-full"
        (onClick)="onAccept.emit(request); $event.stopPropagation()"
      >
        {{ t('acceptRequest') }}
      </app-button>
      }
    </div>
  `,
  styles: [],
})
export class RequestCardComponent {
  @Input({ required: true }) request!: OrderDto;
  @Input() index: number = 0;
  @Input() showActions = false;
  @Input() clickable = true;
  @Input() className?: string;

  @Output() onCardClick = new EventEmitter<OrderDto>();
  @Output() onAccept = new EventEmitter<OrderDto>();

  languageService = inject(LanguageService);
  t = (key: string) => this.languageService.t(key);

  // getMaterialIcon(material?: string): string {
  //   switch (material?.toLowerCase()) {
  //     case 'plastic':
  //       return '♻️';
  //     case 'paper':
  //       return '📄';
  //     case 'glass':
  //       return '🍶';
  //     case 'metal':
  //       return '🔩';
  //     default:
  //       return '🔄';
  //   }
  // }

  getBadgeVariant(
    status?: string
  ): 'default' | 'secondary' | 'destructive' | 'warning' {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'accepted':
        return 'default';
      case 'in-progress':
        return 'secondary';
      case 'collected':
        return 'secondary';
      case 'delivered':
        return 'secondary';
      case 'pending':
        return 'warning';
      default:
        return 'secondary';
    }
  }

  getStatusText(status?: string): string {
    switch (status?.toLowerCase()) {
      case 'completed':
        return this.t('completed') || 'Completed';
      case 'accepted':
        return this.t('accepted') || 'Accepted';
      case 'delivered':
        return this.t('delivered') || 'Delivered';
      case 'in-progress':
        return this.t('inProgress') || 'In Progress';
      case 'collected':
        return this.t('collected') || 'Collected';
      case 'pending':
        return this.t('pending') || 'Pending';
      default:
        return this.t('cancelled') || 'Cancelled';
    }
  }

  formatDate(isoString?: string): string {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString();
  }
}
