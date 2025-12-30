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
import { CitizenHeaderComponent } from './header/header.component';
import { CitizenCollectionRequestComponent } from './collection-request/collection-request.component';
import { CitizenStatsCardsComponent } from './stats-cards/stats-cards.component';
import { CitizenRecentRequestsComponent } from './recent-requests/recent-requests.component';
import { CitizenService } from '@core/services/user.services/citizen.service';
import { OrderService } from '@core/services/order.services/order.service';
import { AuthService } from '@core/services/auth.services/auth.service';
import { OrderDto } from '@core/models/orders/order.model';

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
  private citizenService = inject(CitizenService);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private languageService = inject(LanguageService);
  private destroyRef = inject(DestroyRef);

  points = signal(0);
  totalCollections = signal(0);
modalOpen = signal(false);

  private _recentOrders = signal<OrderDto[]>([]);
  recentRequests = this._recentOrders.asReadonly();

  t = (key: string) => this.languageService.t(key) || '';

  constructor() {
    this.loadPoints();

    effect(() => {
      this.loadUserOrders();
    });
  }

  // ===== Points =====
  private loadPoints(): void {
    this.citizenService
      .getPoints()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => this.points.set(res.points ?? 0),
        error: () => this.points.set(0),
      });
  }

  // ===== Orders =====
  private loadUserOrders(): void {
    const userId = this.authService.getUserIdFromToken(); // ✅ المفتاح هنا

    if (!userId) {
      this._recentOrders.set([]);
      this.totalCollections.set(0);
      return;
    }

    this.orderService
      .getUserOrders(userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (orders) => {
          this.totalCollections.set(orders.length);
          this._recentOrders.set(orders.slice(-5).reverse());
        },
        error: () => {
          this._recentOrders.set([]);
          this.totalCollections.set(0);
        },
      });
  }

  stats = computed(() => [
    {
      id: 'total-collections',
      icon: '📦',
      label: this.t('totalCollections'),
      value: String(this.totalCollections()),
      change: '',
      color: 'text-primary',
    },
    {
      id: 'reward-points',
      icon: '🎁',
      label: this.t('rewardPoints'),
      value: String(this.points()),
      change: '',
      color: 'text-primary',
    },
  ]);

  onRequestCreated(): void {
    this.loadUserOrders();
  }
}
