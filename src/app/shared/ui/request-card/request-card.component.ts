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
        'request-card-wrapper ' +
        (clickable ? 'cursor-pointer' : '') +
        ' ' +
        (className || '')
      "
      (click)="clickable && onCardClick.emit(request)"
    >
      <!-- Header: Material Type & Status -->
      <div class="request-card-header">
        <div class="request-card-title-section">
          <h3 class="request-card-title">
            🔄 Order No. {{ request.id }}
          </h3>
          @if (request.userName) {
          <p class="request-card-subtitle">{{ request.userName }}</p>
          }
        </div>
        <app-badge [variant]="getBadgeVariant(request.status)">
          {{ getStatusText(request.status) }}
        </app-badge>
      </div>

      <!-- Details -->
      <div class="request-card-details">
        <!-- Email -->
        @if (request.email) {
        <div class="detail-item">
          <span class="detail-icon">📧</span>
          <span class="detail-text">{{ request.email }}</span>
        </div>
        }

        <!-- Address -->
        <div class="detail-item">
          <span class="detail-icon">📍</span>
          <span class="detail-text">
            {{ request.buildingNo + ' building, ' }}
            {{ request.apartment ? request.apartment + 'apt., ' : '' }}

            {{ request.street + ' st ,' }}{{ request.city }}
          </span>
        </div>

        <!-- Quantity -->
        @if (request.quantity) {
        <div class="detail-item">
          <span class="detail-icon">⚖️</span>
          <span class="detail-text">{{ request.quantity }} kg</span>
        </div>
        }

        <!-- Order Date -->
        @if (request.orderDate) {
        <div class="detail-item">
          <span class="detail-icon">📅</span>
          <span class="detail-text">{{ formatDate(request.orderDate) }}</span>
        </div>
        }

        <!-- Collector Name (if assigned) -->
        @if (request.collectorName && request.status === 'in-progress') {
        <div class="collector-info">
          <div class="detail-item">
            <span class="detail-icon">🚛</span>
            <div class="collector-details">
              <p class="collector-label">Collector</p>
              <p class="collector-name">
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
  styles: [`
    .request-card-wrapper {
      position: relative;
      margin-bottom: 1rem;
      padding: 1.5rem;
      background: hsla(var(--card), 0.95);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid hsla(var(--border), 0.5);
      border-radius: 16px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
    }

    .request-card-wrapper::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, hsla(var(--primary), 0.05) 0%, transparent 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }

    .request-card-wrapper:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px hsla(0, 0%, 0%, 0.12);
      border-color: hsla(var(--primary), 0.3);
    }

    .request-card-wrapper:hover::before {
      opacity: 1;
    }

    .request-card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .request-card-title-section {
      flex: 1;
    }

    .request-card-title {
      font-weight: 600;
      color: hsl(var(--card-foreground));
      margin-bottom: 0.25rem;
      font-size: 1rem;
    }

    .request-card-subtitle {
      font-size: 0.875rem;
      color: hsl(var(--muted-foreground));
    }

    .request-card-details {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: hsl(var(--muted-foreground));
    }

    .detail-icon {
      font-size: 1.125rem;
      flex-shrink: 0;
    }

    .detail-text {
      line-height: 1.4;
    }

    .collector-info {
      padding: 0.75rem;
      background: hsla(var(--primary), 0.1);
      border-radius: 12px;
      border: 1px solid hsla(var(--primary), 0.2);
    }

    .collector-details {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }

    .collector-label {
      font-size: 0.75rem;
      color: hsl(var(--muted-foreground));
    }

    .collector-name {
      font-weight: 600;
      color: hsl(var(--primary));
      font-size: 0.875rem;
    }
  `],
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
