import { Component, DestroyRef, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../../core/services/data.service';
import { OrderDto } from '@core/models/order.model';
import { CardContentComponent } from '../../../../shared/ui/card/card.component';
import { CollectorService } from '@core/services/collector.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LanguageService } from '@core/services/language.service';
import { BadgeComponent } from '@shared/ui/badge/badge.component';

@Component({
  selector: 'app-collector-available-requests',
  standalone: true,
  imports: [
    CommonModule,
    CardContentComponent,
    BadgeComponent,
  ],
  templateUrl: './available-requests.component.html',
  styleUrl: './available-requests.component.css',
})
export class CollectorAvailableRequestsComponent {
  dataService: DataService = inject(DataService);
  collectorService = inject(CollectorService);
  destroyRef = inject(DestroyRef);

  collectorId = 1;
  pendingRequests = signal<any[]>([]);
  index: number = 0;
  showActions = false;
  clickable = true;
  className?: string;

  languageService = inject(LanguageService);
  t = (key: string) => this.languageService.t(key);
  // pendingRequests = computed(() =>
  //   this.dataService.pendingRequests().filter((r: any) => !r.collectorId || r.collectorId !== this.collectorId)
  // );

  ngOnInit(): void {
    this.loadCollectorOrders();
  }
  private loadCollectorOrders(): void {
    this.collectorService
      .getMyOrders()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (orders) => {
          this.pendingRequests.set(orders || []);
        },
        error: () => {
          this.pendingRequests.set([]);
        },
      });
  }

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

  acceptOrder(orderId: number): void {
    this.collectorService
      .acceptOrder(orderId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadCollectorOrders();
          console.log(`Order ${orderId} accepted successfully.`);
        },
      });
  }

  changeStatus(orderId: number, status: string): void {
    this.collectorService
      .changeStatus(orderId, status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadCollectorOrders();
          console.log(`Order ${orderId} status changed successfully.`);
        },
      });
  }
}
