import { Component, inject, signal, ChangeDetectionStrategy, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../../core/services/order.service';
import { CollectorService } from '../../../../core/services/collector.service';
import { FlashMessageService } from '../../../../core/services/flash-message.service';
import { OrderDto, ApplicationUserDto } from '../../../../core/models/dtos.model';

@Component({
  selector: 'app-order-management',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid mt-4">
      <div class="row mb-4">
        <div class="col">
          <h1>📋 Order Management</h1>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading()" class="text-center py-5">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Error State -->
      <div *ngIf="error()" class="alert alert-danger alert-dismissible fade show">
        {{ error() }}
        <button type="button" class="btn-close" (click)="error.set(null)"></button>
      </div>

      <!-- Stats Cards -->
      <div class="row mb-4" *ngIf="!isLoading()">
        <div class="col-md-3 mb-3" *ngFor="let stat of stats()">
          <div class="card text-center border-start border-4" [class]="stat.class">
            <div class="card-body">
              <h6 class="card-title text-muted">{{ stat.label }}</h6>
              <h2 class="card-text text-primary">{{ stat.value }}</h2>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="row mb-3" *ngIf="!isLoading()">
        <div class="col-md-4">
          <select class="form-select" [(ngModel)]="selectedStatusFilter" (change)="onFilterChange()">
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="PickedUp">Picked Up</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div class="col-md-4">
          <input
            type="text"
            class="form-control"
            placeholder="Search by email or material..."
            [(ngModel)]="searchQuery"
            (input)="onFilterChange()">
        </div>
        <div class="col-md-4">
          <button class="btn btn-secondary w-100" (click)="refresh()">
            🔄 Refresh
          </button>
        </div>
      </div>

      <!-- Orders Table -->
      <div *ngIf="!isLoading() && filteredOrders().length > 0" class="table-responsive">
        <table class="table table-hover">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Material</th>
              <th>Qty</th>
              <th>Location</th>
              <th>Status</th>
              <th>Collector</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let order of filteredOrders()">
              <td><small>{{ order.id }}</small></td>
              <td>{{ order.userName || order.email }}</td>
              <td><strong>{{ order.typeOfMaterial }}</strong></td>
              <td>{{ order.quantity }} kg</td>
              <td><small>{{ order.city }}, {{ order.street }}</small></td>
              <td>
                <span class="badge" [ngClass]="getStatusBadgeClass(order.status)">
                  {{ order.status }}
                </span>
              </td>
              <td>
                <div *ngIf="order.collectorName; else noCollector">
                  {{ order.collectorName }}
                </div>
                <ng-template #noCollector>
                  <select class="form-select form-select-sm"
                    (change)="assignCollector(order, $event)"
                    [disabled]="order.status !== 'Pending'">
                    <option value="">Assign...</option>
                    <option *ngFor="let c of collectors()" [value]="c.id">
                      {{ c.firstName }} {{ c.lastName }}
                    </option>
                  </select>
                </ng-template>
              </td>
              <td><small>{{ formatDate(order.orderDate) }}</small></td>
              <td>
                <div class="btn-group btn-group-sm">
                  <button class="btn btn-info" [disabled]="order.status === 'Completed'"
                    (click)="updateStatus(order, getNextStatus(order.status))">
                    Next →
                  </button>
                  <button class="btn btn-danger" (click)="deleteOrder(order)">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading() && filteredOrders().length === 0" class="alert alert-info text-center py-5">
        <h4>No orders found</h4>
        <p class="text-muted">Try adjusting your filters</p>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .btn-primary { background-color: #10b981; border-color: #10b981; }
    .btn-primary:hover { background-color: #059669; }
    .table-hover tbody tr:hover { background-color: #f0f9ff; }
  `]
})
export class OrderManagementComponent implements OnInit {
  private orderService = inject(OrderService);
  private collectorService = inject(CollectorService);
  private flashMessage = inject(FlashMessageService);

  isLoading = signal(false);
  error = signal<string | null>(null);
  allOrders = signal<OrderDto[]>([]);
  collectors = signal<ApplicationUserDto[]>([]);
  selectedStatusFilter = '';
  searchQuery = '';

  filteredOrders = computed(() => {
    let orders = this.allOrders();

    // Filter by status
    if (this.selectedStatusFilter) {
      orders = orders.filter(o => o.status === this.selectedStatusFilter);
    }

    // Filter by search query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      orders = orders.filter(o =>
        (o.userName || o.email)?.toLowerCase().includes(query) ||
        (o.typeOfMaterial)?.toLowerCase().includes(query)
      );
    }

    return orders;
  });

  stats = computed(() => [
    {
      label: 'Total Orders',
      value: this.allOrders().length,
      class: 'border-primary'
    },
    {
      label: 'Pending',
      value: this.allOrders().filter(o => o.status === 'Pending').length,
      class: 'border-warning'
    },
    {
      label: 'In Progress',
      value: this.allOrders().filter(o => o.status === 'Accepted' || o.status === 'PickedUp').length,
      class: 'border-info'
    },
    {
      label: 'Completed',
      value: this.allOrders().filter(o => o.status === 'Completed').length,
      class: 'border-success'
    }
  ]);

  ngOnInit(): void {
    this.loadOrders();
    this.loadCollectors();
  }

  private loadOrders(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.allOrders.set(orders);
        this.isLoading.set(false);
      },
      error: (err) => {
        const message = err.error?.message || 'Failed to load orders';
        this.error.set(message);
        this.isLoading.set(false);
      }
    });
  }

  private loadCollectors(): void {
    this.collectorService.getAllCollectors().subscribe({
      next: (collectors) => this.collectors.set(collectors),
      error: (err) => console.error('Error loading collectors:', err)
    });
  }

  onFilterChange(): void {
    // Reactive filtering via computed property
  }

  refresh(): void {
    this.loadOrders();
  }

  assignCollector(order: OrderDto, event: any): void {
    const collectorId = event.target.value;
    if (!collectorId) return;

    this.orderService.assignOrder(order.id, { orderId: order.id, collectorId: +collectorId }).subscribe({
      next: () => {
        this.flashMessage.showSuccess('Order assigned successfully');
        this.loadOrders();
      },
      error: (err) => {
        const message = err.error?.message || 'Failed to assign order';
        this.flashMessage.showError(message);
      }
    });
  }

  updateStatus(order: OrderDto, newStatus: string): void {
    this.orderService.updateOrderStatus(order.id, { newStatus }).subscribe({
      next: () => {
        this.flashMessage.showSuccess(`Order status updated to ${newStatus}`);
        this.loadOrders();
      },
      error: (err) => {
        const message = err.error?.message || 'Failed to update order';
        this.flashMessage.showError(message);
      }
    });
  }

  deleteOrder(order: OrderDto): void {
    if (!confirm(`Delete order #${order.id}?`)) return;

    this.orderService.deleteOrder(order.id).subscribe({
      next: () => {
        this.flashMessage.showSuccess('Order deleted successfully');
        this.loadOrders();
      },
      error: (err) => {
        const message = err.error?.message || 'Failed to delete order';
        this.flashMessage.showError(message);
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Pending': return 'bg-warning text-dark';
      case 'Accepted': return 'bg-info';
      case 'PickedUp': return 'bg-primary';
      case 'Completed': return 'bg-success';
      default: return 'bg-secondary';
    }
  }

  getNextStatus(currentStatus: string): string {
    switch (currentStatus) {
      case 'Pending': return 'Accepted';
      case 'Accepted': return 'PickedUp';
      case 'PickedUp': return 'Completed';
      default: return currentStatus;
    }
  }

  formatDate(date: string): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
