import { CitizenService } from '../../../core/services/user.services/citizen.service';
import { Component, inject,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.services/order.service';
import { AuthService } from '../../../core/services/auth.services/auth.service';
import { Order } from '../../../core/models/orders/order.model';
import { Role } from '../../../core/models/users/role.enum';
import { forkJoin } from 'rxjs';
import { FactoryService } from '../../../core/services/factory.services/factory.service';
import { CollectorService } from '../../../core/services/collector.sevices/collector.service';
import { FlashMessageService } from '../../../core/services/flash-message.service';


@Component({
  standalone: true,
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.html',
  styleUrls: ['./manage-orders.css'],
  imports: [CommonModule, FormsModule]
})
export class ManageOrdersComponent {

  private service = inject(OrderService);
  private auth = inject(AuthService);
private citizenService = inject(CitizenService);
private factoryService = inject(FactoryService);
private collectorService = inject(CollectorService);
private cdr = inject(ChangeDetectorRef);
private flash = inject(FlashMessageService);

  orders: Order[] = [];
  filteredOrders: Order[] = [];   // ✅ الجديد
  selectedOrder: Order | null = null;

  statusFilter = '';
  collectorFilter = '';
  factoryFilter = '';
  userFilter = '';

  ngOnInit() {
    this.load();
  }

  load() {
  forkJoin({
    orders: this.service.getAll(),
    users: this.citizenService.getAll(),
    factories: this.factoryService.getAll(),
    collectors: this.collectorService.getAll()
  }).subscribe(({ orders, users, factories, collectors }) => {

    this.orders = orders.map(o => ({
      ...o,
      userName: users.find(u => u.id === o.userId)?.fullName ?? '—',
      collectorName: collectors.find(c => c.id === o.collectorId)?.fullName ?? '—',
      factoryName: factories.find(f => f.id === o.factoryId)?.name ?? '—'
    }));

    // 🔥 مهم جدًا
    this.filteredOrders = [...this.orders];
  });
}


  // ================= FILTER =================
  filter() {
    let filtered = [...this.orders];

    if (this.statusFilter.trim()) {
      filtered = filtered.filter(o =>
        o.status?.toLowerCase().includes(this.statusFilter.toLowerCase())
      );
    }

    if (this.userFilter.trim()) {
      filtered = filtered.filter(o =>
        o.userName?.toLowerCase().includes(this.userFilter.toLowerCase())
      );
    }

    if (this.collectorFilter.trim()) {
      filtered = filtered.filter(o =>
        o.collectorName?.toLowerCase().includes(this.collectorFilter.toLowerCase())
      );
    }

    if (this.factoryFilter.trim()) {
      filtered = filtered.filter(o =>
        o.factoryName?.toLowerCase().includes(this.factoryFilter.toLowerCase())
      );
    }

    this.filteredOrders = filtered; // ✅
  }

  clearFilters() {
    this.statusFilter = '';
    this.userFilter = '';
    this.collectorFilter = '';
    this.factoryFilter = '';
    this.filteredOrders = this.orders; // ✅
  }

  // ================= DETAILS =================
showDetails(id: number) {
  this.selectedOrder = null;

  this.service.getById(id).subscribe(res => {
    this.selectedOrder = res;
    this.cdr.detectChanges();
  });
}


  closeDetails() {
    this.selectedOrder = null;
  }

  // ================= ADMIN =================
  isAdmin(): boolean {
    return this.auth.getRole() === Role.Admin;
  }

canComplete(): boolean {
  return (
    this.isAdmin() &&
    this.selectedOrder?.status?.toLowerCase() === 'delivered'
  );
}


completeOrder() {
  if (!this.selectedOrder) return;

  console.log('Completing order:', this.selectedOrder.id);

  this.service.complete(this.selectedOrder.id!)
    .subscribe({
      next: (res: any) => {
        console.log('Order completed:', res);

        this.flash.showSuccess(
          res?.message || 'Order completed successfully'
        );

        this.load();          // reload orders
        this.closeDetails();  // close modal
      },
      error: err => {
        console.error('Complete order failed:', err);

        if (err.status === 401 || err.status === 403) {
          this.flash.showError(
            'You are not authorized to complete this order (Admin only)'
          );
        } else if (err.status === 400) {
          this.flash.showError(
            err.error?.error || 'Invalid order state'
          );
        } else {
          this.flash.showError('Something went wrong');
        }
      }
    });
}


}
