import { Component, inject, signal, computed, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrderDto } from '@core/models/order.model';
import { DataService } from '@core/services/data.service';
import { LanguageService } from '@core/services/language.service';
import { UserService } from '@core/services/user.service';
import { CardComponent, CardContentComponent } from '@shared/ui/card/card.component';
import { RequestCardComponent } from '@shared/ui/request-card/request-card.component';
import { TabsListComponent, TabsTriggerComponent } from '@shared/ui/tabs/tabs.component';
import { CollectorService } from '@core/services/collector.service';


@Component({
  selector: 'app-collector-requests',
  standalone: true,
  imports: [
    CommonModule,
    RequestCardComponent,
    CardComponent,
    CardContentComponent,
    TabsListComponent,
    TabsTriggerComponent
  ],
  template: `
    <div class="">
      <div class="max-w-7xl mx-auto space-y-8">

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
              <div class="text-2xl font-bold text-accent">{{ deliveredCount() }}</div>
              <p class="text-sm text-muted-foreground">{{ t('Delivered') }}</p>
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
               @case ('collected') {
                <ng-container *ngTemplateOutlet="requestsTemplate; context: { requests: getRequestsByStatus('collected'), emptyIcon: '✅', emptyText: 'No collected requests' }"></ng-container>
              }
              @case ('delivered') {
                <ng-container *ngTemplateOutlet="requestsTemplate; context: { requests: getRequestsByStatus('delivered'), emptyIcon: '🔄', emptyText: 'No delivered requests' }"></ng-container>
              }
              @case ('completed') {
                <ng-container *ngTemplateOutlet="requestsTemplate; context: { requests: getRequestsByStatus('completed'), emptyIcon: '✅', emptyText: 'No completed requests' }"></ng-container>
              }

              <!-- @case ('cancelled') {
                <ng-container *ngTemplateOutlet="requestsTemplate; context: { requests: getRequestsByStatus('cancelled'), emptyIcon: '❌', emptyText: 'No cancelled requests' }"></ng-container>
              } -->
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
export class CollectorRequestsComponent {
  languageService = inject(LanguageService);
  dataService = inject(DataService);
  userService = inject(UserService);
  destroyRef = inject(DestroyRef);
  collectorService = inject(CollectorService);

  selectedTab = signal<string>('all');
  modalOpen = signal(false);
  userRequests = signal<OrderDto[]>([]);

  tabs = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    // { value: 'in-progress', label: 'In Progress' },
    { value: 'collected', label: 'Collected' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'completed', label: 'Completed' },
    // { value: 'cancelled', label: 'Cancelled' }
  ];

  t = (key: string) => this.languageService.t(key);

  constructor() {
    this.loadUserOrders();
  }

  /**
   * Load user's orders from API and update local state
   */
  private loadUserOrders(): void {
    const user = this.dataService.currentUser();
    const userId = user?.id;

    if (!userId) {
      this.userRequests.set([]);
      return;
    }

    this.collectorService.getAllOrders()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (orders) => {
          this.userRequests.set(orders.reverse() || []);
        },
        error: () => {
          this.userRequests.set([]);
        }
      });
  }

  completedCount = computed(() =>
    this.userRequests().filter(r => r.status.toLocaleLowerCase() === 'completed').length
  );

  deliveredCount = computed(() =>
    this.userRequests().filter(r => r.status.toLocaleLowerCase() === 'delivered').length
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
