import { Component, inject, signal, computed, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { UserService } from '../../../core/services/user.services/user.service';
import { OrderService } from '../../../core/services/order.services/order.service';
import { OrderDto } from '@core/models/orders/order.model';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { RequestCardComponent } from '../../../shared/ui/request-card/request-card.component';
import { CardComponent, CardContentComponent } from '../../../shared/ui/card/card.component';
import { CreateCollectionModalComponent } from '../citizen-dashboard/create-collection-modal/create-collection-modal.component';
import { TabsListComponent, TabsTriggerComponent } from '../../../shared/ui/tabs/tabs.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CitizenService } from '@core/services/user.services/citizen.service';

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    RequestCardComponent,
    CardComponent,
    CardContentComponent,
    CreateCollectionModalComponent,
    TabsListComponent,
    TabsTriggerComponent
  ],
  template: `
    <div class="requests-container">
      <!-- Animated Background -->
      <div class="background-orb orb-1"></div>
      <div class="background-orb orb-2"></div>
      
      <div class="content-wrapper">
        <!-- Header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">{{ t('myRequests') }}</h1>
            <p class="page-subtitle">Manage your collection requests</p>
          </div>
          <app-button (onClick)="modalOpen.set(true)" size="lg" class="gap-2 shadow-md">
            <span>➕</span>
            {{ t('createRequest') }}
          </app-button>
        </div>

        <app-create-collection-modal
          [open]="modalOpen()"
          (openChange)="modalOpen.set($event)"
          (requestCreated)="onRequestCreated()"
        ></app-create-collection-modal>

        <!-- Stats -->
        <div class="stats-grid">
          <app-card class="stat-card">
            <app-card-content class="stat-card-content">
              <div class="stat-value">{{ userRequests().length }}</div>
              <p class="stat-label">Total Requests</p>
            </app-card-content>
          </app-card>
          <app-card class="stat-card">
            <app-card-content class="stat-card-content">
              <div class="stat-value">{{ completedCount() }}</div>
              <p class="stat-label">{{ t('completed') }}</p>
            </app-card-content>
          </app-card>
          <app-card class="stat-card">
            <app-card-content class="stat-card-content">
              <div class="stat-value stat-value-accent">{{ inProgressCount() }}</div>
              <p class="stat-label">{{ t('inProgress') }}</p>
            </app-card-content>
          </app-card>
          <app-card class="stat-card">
            <app-card-content class="stat-card-content">
              <div class="stat-value stat-value-muted">{{ pendingCount() }}</div>
              <p class="stat-label">{{ t('pending') }}</p>
            </app-card-content>
          </app-card>
        </div>

        <!-- Tabs -->
        <div class="tabs-container">
          <app-tabs-list class="grid w-full mb-6">
            <app-tabs-trigger
              *ngFor="let tab of tabs"
              [value]="tab.value"
              [isActive]="selectedTab() === tab.value"
              (onClick)="selectedTab.set($event)"
            >
              {{ tab.label }}
            </app-tabs-trigger>
          </app-tabs-list>

          <div class="space-y-4">
            @switch (selectedTab()) {
              @case ('all') {
                <ng-container *ngTemplateOutlet="requestsTemplate; context: { requests: userRequests(), emptyIcon: '📦', emptyText: 'No requests found' }"></ng-container>
              }
              @case ('pending') {
                <ng-container *ngTemplateOutlet="requestsTemplate; context: { requests: getRequestsByStatus('pending'), emptyIcon: '⏳', emptyText: 'No pending requests' }"></ng-container>
              }
              @case ('in-progress') {
                <ng-container *ngTemplateOutlet="requestsTemplate; context: { requests: getRequestsByStatus('in-progress'), emptyIcon: '🔄', emptyText: 'No in-progress requests' }"></ng-container>
              }
              @case ('completed') {
                <ng-container *ngTemplateOutlet="requestsTemplate; context: { requests: getRequestsByStatus('completed'), emptyIcon: '✅', emptyText: 'No completed requests' }"></ng-container>
              }
              @case ('cancelled') {
                <ng-container *ngTemplateOutlet="requestsTemplate; context: { requests: getRequestsByStatus('cancelled'), emptyIcon: '❌', emptyText: 'No cancelled requests' }"></ng-container>
              }
            }
          </div>
        </div>
      </div>
    </div>

    <ng-template #requestsTemplate let-requests="requests" let-emptyIcon="emptyIcon" let-emptyText="emptyText">
      @for (request of requests; track request.id) {
        <app-request-card
          [request]="request"
          [clickable]="false"
          [showActions]="false"
        ></app-request-card>
      }
      @if (requests.length === 0) {
        <app-card class="empty-card">
          <app-card-content class="empty-card-content">
            <span class="empty-icon">{{ emptyIcon }}</span>
            <p class="empty-text">{{ emptyText }}</p>
          </app-card-content>
        </app-card>
      }
    </ng-template>
  `,
  styles: [`
    .requests-container {
      position: relative;
      min-height: calc(100vh - 70px);
      background: hsl(var(--background));
      overflow: hidden;
      padding: 2rem 1rem;
    }

    /* Animated Background Orbs */
    .background-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.3;
      animation: float 20s infinite ease-in-out;
      pointer-events: none;
      z-index: 0;
    }

    .orb-1 {
      width: 500px;
      height: 500px;
      background: hsl(var(--primary));
      top: -10%;
      left: -10%;
    }

    .orb-2 {
      width: 400px;
      height: 400px;
      background: hsl(var(--accent));
      bottom: -10%;
      right: -10%;
      animation-delay: 10s;
    }

    @keyframes float {
      0%, 100% {
        transform: translate(0, 0) scale(1);
      }
      33% {
        transform: translate(30px, -30px) scale(1.1);
      }
      66% {
        transform: translate(-20px, 20px) scale(0.9);
      }
    }

    .content-wrapper {
      position: relative;
      z-index: 1;
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .page-header {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    @media (min-width: 640px) {
      .page-header {
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
      }
    }

    .page-title {
      font-size: 1.875rem;
      font-weight: 700;
      background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
    }

    @media (min-width: 768px) {
      .page-title {
        font-size: 2.25rem;
      }
    }

    .page-subtitle {
      color: hsl(var(--muted-foreground));
      margin-top: 0.5rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    @media (min-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .stat-card {
      position: relative;
      background: hsla(var(--card), 0.95);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid hsla(var(--border), 0.5);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, hsla(var(--primary), 0.05) 0%, transparent 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px hsla(0, 0%, 0%, 0.12);
    }

    .stat-card:hover::before {
      opacity: 1;
    }

    .stat-card-content {
      padding: 1rem;
      text-align: center;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stat-value-accent {
      background: linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--primary)) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stat-value-muted {
      color: hsl(var(--muted-foreground));
      background: none;
      -webkit-text-fill-color: unset;
    }

    .stat-label {
      font-size: 0.875rem;
      color: hsl(var(--muted-foreground));
      margin-top: 0.25rem;
    }

    .tabs-container {
      width: 100%;
    }

    .empty-card {
      background: hsla(var(--card), 0.95);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid hsla(var(--border), 0.5);
    }

    .empty-card-content {
      padding: 2rem;
      text-align: center;
    }

    .empty-icon {
      font-size: 2.5rem;
      display: block;
      margin-bottom: 1rem;
    }

    .empty-text {
      color: hsl(var(--muted-foreground));
    }
  `]
})
export class MyRequestsComponent {
  languageService = inject(LanguageService);
  userService = inject(UserService);
  orderService = inject(OrderService);
  destroyRef = inject(DestroyRef);
citizenService = inject(CitizenService);

  selectedTab = signal<string>('all');
  modalOpen = signal(false);
  userRequests = signal<OrderDto[]>([]);

  tabs = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  t = (key: string) => this.languageService.t(key);

  constructor() {
    this.loadUserOrders();
  }

  /**
   * Load user's orders from API and update local state
   */
  private loadUserOrders(): void {
  this.citizenService.getProfile().subscribe({
    next: (user) => {
      const userId = user.id;

      if (!userId) {
        this.userRequests.set([]);
        return;
      }

      this.orderService
        .getUserOrders(String(userId))
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (orders) => {
            this.userRequests.set(orders || []);
          },
          error: () => {
            this.userRequests.set([]);
          }
        });
    },
    error: () => {
      this.userRequests.set([]);
    }
  });
}


  completedCount = computed(() =>
    this.userRequests().filter(r => r.status.toLocaleLowerCase() === 'completed').length
  );

  inProgressCount = computed(() =>
    this.userRequests().filter(r => r.status.toLocaleLowerCase() === 'in-progress').length
  );

  pendingCount = computed(() =>
    this.userRequests().filter(r => r.status.toLocaleLowerCase() === 'pending').length
  );

  getRequestsByStatus(status: string): OrderDto[] {
    return this.userRequests().filter(r => r.status.toLocaleLowerCase() === status.toLocaleLowerCase());
  }

  onRequestCreated(): void {
    // Refresh the requests list from the API
    this.loadUserOrders();
    // Switch to the pending tab to show the new request
    this.selectedTab.set('pending');
  }
}
