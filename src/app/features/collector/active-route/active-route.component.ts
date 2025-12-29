import { Component, inject, signal, DestroyRef, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../core/services/data.service';
import { ThemeService } from '../../../core/services/theme.service';
import { CollectorService } from '../../../core/services/collector.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CardContentComponent } from '../../../shared/ui/card/card.component';
import { LanguageService } from '../../../core/services/language.service';
import { BadgeComponent } from '../../../shared/ui/badge/badge.component';

@Component({
  selector: 'app-collector-active-route',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    CardContentComponent,
    BadgeComponent
  ],
  templateUrl: './active-route.component.html',
  styleUrl: './active-route.component.css',
  host: {
    '[class.dark]': 'isDarkMode()'
  }
})
export class CollectorActiveRouteComponent {
  dataService: DataService = inject(DataService);
  collectorService = inject(CollectorService);
  destroyRef = inject(DestroyRef);
  languageService = inject(LanguageService);
  themeService = inject(ThemeService);

  isDarkMode = computed(() => this.themeService.theme() === 'dark');

  collectorId = 1;
  activeRouteRequests = signal<any[]>([]);

  t = (key: string) => this.languageService.t(key);

  ngOnInit(): void {
    this.loadActiveRoute();
  }

  /**
   * Load active (accepted/collected) orders from API
   */
  private loadActiveRoute(): void {
    this.collectorService
      .getMyOrders()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (orders) => {
          if (!orders) {
            this.activeRouteRequests.set([]);
            return;
          }

          // Get active orders (accepted or collected) sorted by route order
          const activeOrders = orders
            .filter((o: any) => {
              const status = o.status?.toLowerCase();
              return status === 'accepted' || status === 'collected';
            })
            .sort((a: any, b: any) => (a.routeOrder || 0) - (b.routeOrder || 0));

          this.activeRouteRequests.set(activeOrders);
        },
        error: (err) => {
          console.error('Failed to load active route:', err);
          this.activeRouteRequests.set([]);
        },
      });
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
        return 'warning';
      case 'in-progress':
        return 'secondary';
      case 'collected':
        return 'secondary';
      case 'delivered':
        return 'default';
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

  changeStatus(orderId: number, status: string): void {
    this.collectorService
      .changeStatus(orderId, status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadActiveRoute();
          console.log(`Order ${orderId} status changed to ${status} successfully.`);
        },
        error: (err) => {
          console.error('Failed to change order status:', err);
        }
      });
  }
}
