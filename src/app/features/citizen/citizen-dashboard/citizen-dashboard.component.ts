import {
  Component,
  inject,
  signal,
  computed,
  effect,
  ChangeDetectionStrategy,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LanguageService } from '../../../core/services/language.service';
import { DataService } from '../../../core/services/data.service';
import { OrderDto } from '@core/models/order.model';
import { CitizenHeaderComponent } from './header/header.component';
import { CitizenCollectionRequestComponent } from './collection-request/collection-request.component';
import { CitizenStatsCardsComponent } from './stats-cards/stats-cards.component';
import { CitizenRecentRequestsComponent } from './recent-requests/recent-requests.component';
import { CitizenService } from '@core/services/citizen.service';
import { OrderService } from '@core/services/order.service';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-citizen-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    CitizenHeaderComponent,
    CitizenCollectionRequestComponent,
    CitizenStatsCardsComponent,
    CitizenRecentRequestsComponent,
  ],
  templateUrl: './citizen-dashboard.component.html',
  styleUrl: './citizen-dashboard.component.css',
})
export class CitizenDashboardComponent {
  languageService: LanguageService = inject(LanguageService);
  dataService: DataService = inject(DataService);
  citizenService = inject(CitizenService);
  orderService = inject(OrderService);
  authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  modalOpen = signal(false);
  points = signal<number>(0);
  totalCollections = signal<number>(0);

  private _recentOrders = signal<OrderDto[]>([]);
  recentRequests = this._recentOrders.asReadonly();

  t = (key: string) => this.languageService.t(key) || '';

  constructor() {
    // Sync user data from token to localStorage

    this.citizenService
      .getPoints()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (response) => {
          this.points.set(response.points);
        },
        () => {
          this.points.set(0);
        }
      );

    // Load user's recent orders when userId changes
    effect(() => {
      this.loadUserOrders();
    });
  }

  /**
   * Load user's orders from API and update local state
   */
  private loadUserOrders(): void {
    const user = this.dataService.currentUser();
    const userId = user?.id;

    if (!userId) {
      this._recentOrders.set([]);
      return;
    }

    this.orderService.getUserOrders(String(userId))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (orders) => {
          this.totalCollections.set(orders.length);
          // Get the last 5 recent orders (most recent first)
          const recentOrders = orders?.slice(-5)?.reverse() || [];
          this._recentOrders.set(recentOrders);
        },
        error: () => {
          this._recentOrders.set([]);
        }
      });
  }

  // Get user-specific stats
  stats = computed(() => {
    return [
      {
        id: 'total-collections',
        icon: '📦',
        label: this.t('totalCollections'),
        value: String(this.totalCollections()),
        change: '',
        color: 'text-primary',
      },
      // {
      //   id: 'co2-saved',
      //   icon: '📈',
      //   label: this.t('co2Saved'),
      //   value: '145 kg',
      //   change: '+12 kg this week',
      //   color: 'text-accent',
      // },
      {
        id: 'reward-points',
        icon: '🎁',
        label: this.t('rewardPoints'),
        value: String(this.points()),
        change: '',
        color: 'text-primary',
      },
    ];
  });

  onRequestCreated(): void {
    // Reload user's orders to ensure data consistency
    this.loadUserOrders();
  }
}
