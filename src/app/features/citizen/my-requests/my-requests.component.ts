import { Component, inject, signal, computed, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { UserService } from '../../../core/services/user.service';
import { OrderService } from '../../../core/services/order.service';
import { OrderDto } from '@core/models/order.model';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { RequestCardComponent } from '../../../shared/ui/request-card/request-card.component';
import { CardComponent, CardContentComponent } from '../../../shared/ui/card/card.component';
import { CreateCollectionModalComponent } from '../citizen-dashboard/create-collection-modal/create-collection-modal.component';
import { TabsListComponent, TabsTriggerComponent } from '../../../shared/ui/tabs/tabs.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CitizenService } from '@core/services/citizen.service';

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
    <div class="min-h-screen py-8 px-4 md:px-6 lg:px-8 pb-24 md:pb-8">
      <div class="max-w-7xl mx-auto space-y-8">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-foreground">{{ t('myRequests') }}</h1>
            <p class="text-muted-foreground mt-2">Manage your collection requests</p>
          </div>
          <app-button (onClick)="modalOpen.set(true)"  size="lg" class="gap-2 shadow-md">
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
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <app-card>
            <app-card-content class="p-4 text-center">
              <div class="text-2xl font-bold text-primary">{{ userRequests().length }}</div>
              <p class="text-sm text-muted-foreground">Total Requests</p>
            </app-card-content>
          </app-card>
          <app-card>
            <app-card-content class="p-4 text-center">
              <div class="text-2xl font-bold text-primary">{{ completedCount() }}</div>
              <p class="text-sm text-muted-foreground">{{ t('completed') }}</p>
            </app-card-content>
          </app-card>
          <app-card>
            <app-card-content class="p-4 text-center">
              <div class="text-2xl font-bold text-accent">{{ inProgressCount() }}</div>
              <p class="text-sm text-muted-foreground">{{ t('inProgress') }}</p>
            </app-card-content>
          </app-card>
          <app-card>
            <app-card-content class="p-4 text-center">
              <div class="text-2xl font-bold text-muted-foreground">{{ pendingCount() }}</div>
              <p class="text-sm text-muted-foreground">{{ t('pending') }}</p>
            </app-card-content>
          </app-card>
        </div>

        <!-- Tabs -->
        <div class="w-full">
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
        <app-card>
          <app-card-content class="p-8 text-center">
            <span class="text-4xl mb-4 block">{{ emptyIcon }}</span>
            <p class="text-muted-foreground">{{ emptyText }}</p>
          </app-card-content>
        </app-card>
      }
    </ng-template>
  `,
  styles: []
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
