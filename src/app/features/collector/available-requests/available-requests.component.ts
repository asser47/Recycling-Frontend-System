import { Component, DestroyRef, inject, output, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../core/services/data.service';
import { ThemeService } from '../../../core/services/theme.service';
import { OrderDto } from '../../../core/models/order.model';
import { CardContentComponent } from '../../../shared/ui/card/card.component';
import { CollectorService } from '../../../core/services/collector.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LanguageService } from '../../../core/services/language.service';
import { BadgeComponent } from '../../../shared/ui/badge/badge.component';

@Component({
  selector: 'app-collector-available-requests',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    CardContentComponent,
    BadgeComponent,
  ],
  templateUrl: './available-requests.component.html',
  styleUrl: './available-requests.component.css',
  host: {
    '[class.dark]': 'isDarkMode()'
  }
})
export class CollectorAvailableRequestsComponent {
  dataService: DataService = inject(DataService);
  collectorService = inject(CollectorService);
  destroyRef = inject(DestroyRef);
  themeService = inject(ThemeService);

  isDarkMode = computed(() => this.themeService.theme() === 'dark');

  collectorId = 1;
  pendingRequests = signal<any[]>([]);
  activeOrders = signal<any[]>([]); // Track active orders
  index: number = 0;
  showActions = false;
  clickable = true;
  className?: string;
  maxActiveOrders = 2; // Maximum 2 active orders

  languageService = inject(LanguageService);
  t = (key: string) => this.languageService.t(key);
  // pendingRequests = computed(() =>
  //   this.dataService.pendingRequests().filter((r: any) => !r.collectorId || r.collectorId !== this.collectorId)
  // );

  ngOnInit(): void {
    this.loadAvailableOrders();
  }

  /**
   * Load available orders (pending orders from all users)
   */
  private loadAvailableOrders(): void {
    this.collectorService
      .getAvailableOrders()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (orders) => {
          if (!orders) {
            this.pendingRequests.set([]);
            this.activeOrders.set([]);
            return;
          }

          // Get pending orders sorted by date (oldest first)
          const pending = orders
            .filter((o: any) => o.status?.toLowerCase() === 'pending')
            .sort((a: any, b: any) => {
              const dateA = new Date(a.orderDate).getTime();
              const dateB = new Date(b.orderDate).getTime();
              return dateA - dateB; // Oldest first
            });

          // Get active orders (accepted or collected only) - from collector's own orders
          this.loadCollectorActiveOrders();

          this.pendingRequests.set(pending);
        },
        error: (err) => {
          console.error('Failed to load available orders:', err);
          this.pendingRequests.set([]);
        },
      });
  }

  /**
   * Load collector's active orders separately
   */
  private loadCollectorActiveOrders(): void {
    this.collectorService
      .getMyOrders()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (orders) => {
          if (!orders) {
            this.activeOrders.set([]);
            return;
          }

          // Get active orders (accepted or collected only)
          const active = orders.filter((o: any) => {
            const status = o.status?.toLowerCase();
            return status === 'accepted' || status === 'collected';
          });

          this.activeOrders.set(active);
        },
        error: (err) => {
          console.error('Failed to load active orders:', err);
          this.activeOrders.set([]);
        },
      });
  }

  /**
   * Load collector's orders (old method - keep for refresh)
   */

  selectRequest = output<OrderDto>();
  acceptRequest = output<OrderDto>();

  onCardClick(request: OrderDto): void {
    this.selectRequest.emit(request);
  }

  onAccept(request: OrderDto): void {
    this.acceptRequest.emit(request);
  }

  formatDate(isoString?: string): string {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString();
  }

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

  canAcceptOrder(): boolean {
    return this.activeOrders().length < this.maxActiveOrders;
  }

  getActiveOrderCount(): number {
    return this.activeOrders().length;
  }

  acceptOrder(orderId: number): void {
    if (!this.canAcceptOrder()) {
      alert(`You can only accept up to ${this.maxActiveOrders} orders at a time. Complete one first.`);
      return;
    }

    this.collectorService
      .acceptOrder(orderId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadAvailableOrders();
          this.loadCollectorActiveOrders();
          console.log(`Order ${orderId} accepted successfully.`);
        },
        error: () => {
          alert('Failed to accept order. Please try again.');
        }
      });
  }

  changeStatus(orderId: number, status: string): void {
    this.collectorService
      .changeStatus(orderId, status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadAvailableOrders();
          this.loadCollectorActiveOrders();
          console.log(`Order ${orderId} status changed to ${status}.`);
        },
        error: (err) => {
          alert('Failed to update order status. Please try again.');
          console.error('Error:', err);
        }
      });
  }
}
