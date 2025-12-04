import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { Order } from '../../../core/models/order.model';

@Component({
  standalone: true,
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.html',
  styleUrls: ['./manage-orders.css'],
  imports: [CommonModule, FormsModule]
})
export class ManageOrdersComponent {

  private service = inject(OrderService);
  public auth = inject(AuthService);

  orders: Order[] = [];
  selectedOrder: Order | null = null;

  statusFilter = '';
  collectorFilter = '';
  factoryFilter = '';

  // For Creating Order
  newOrder: Partial<Order> = {
    orderDate: new Date().toISOString(),
    status: 'Pending'
  };

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.getAll().subscribe(res => this.orders = res);
  }

  filter() {
    if (this.statusFilter) return this.service.getByStatus(this.statusFilter).subscribe(res => this.orders = res);
    if (this.factoryFilter) return this.service.getByFactory(+this.factoryFilter).subscribe(res => this.orders = res);
    if (this.collectorFilter) return this.service.getByCollector(this.collectorFilter).subscribe(res => this.orders = res);

    return this.load();
  }

  showDetails(id: number) {
    this.service.getById(id).subscribe(res => this.selectedOrder = res);
  }

  closeDetails() {
    this.selectedOrder = null;
  }

  isAdmin() {
    return this.auth.getRole() === 'Admin';
  }

  createOrder() {
    // if admin => choose user & collector
    if (!this.newOrder.userId || !this.newOrder.collectorId || !this.newOrder.factoryId) {
      alert("Please fill all fields");
      return;
    }

    this.service.create(this.newOrder).subscribe(() => {
      this.load();
      this.newOrder = { orderDate: new Date().toISOString(), status: 'Pending' };
    });
  }

  updateStatus(newStatus: string) {
    if (!this.selectedOrder) return;

    this.service.update(this.selectedOrder.id!, { status: newStatus })
      .subscribe(() => {
        this.load();
        this.closeDetails();
      });
  }
}
