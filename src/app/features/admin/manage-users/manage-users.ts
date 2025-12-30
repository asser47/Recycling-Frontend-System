import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminUserService } from '../../../core/services/admin.services/admin-citizen.service';
import { ApplicationUser } from '../../../core/models/users/application-user.model';
import { Order } from '../../../core/models/orders/order.model';
import { debounce } from '@core/utils/performance.util';

@Component({
  standalone: true,
  selector: 'app-manage-users',
  templateUrl: './manage-users.html',
  styleUrls: ['./manage-users.css'],
  imports: [CommonModule, FormsModule]
})
export class ManageUsersComponent {

  private service = inject(AdminUserService);
  private cdr = inject(ChangeDetectorRef);


  users: ApplicationUser[] = [];
  filteredUsers: ApplicationUser[] = [];

  selectedUser: ApplicationUser | null = null;
  userOrders: Order[] = [];

  search = '';

  // Debounced filter - waits 300ms after user stops typing before filtering
  debouncedFilter = debounce(() => this.performFilter(), 300);

  ngOnInit() {
    this.load();
  }

load() {
  this.service.getAll().subscribe(res => {
    this.users = res;
    this.filteredUsers = res;

    // 👇 إجبار Angular يحدث الـ UI
    this.cdr.detectChanges();
  });
}


  /**
   * Called on every input change - uses debouncing to avoid excessive filtering
   */
  onSearchChange() {
    this.debouncedFilter();
  }

  /**
   * Actual filtering logic executed after debounce delay
   */
  private performFilter() {
    const val = this.search.toLowerCase();
    this.filteredUsers = this.users.filter(u =>
      u.fullName.toLowerCase().includes(val) ||
      u.email.toLowerCase().includes(val)
    );
    this.cdr.detectChanges();
  }

viewDetails(user: ApplicationUser) {
  this.selectedUser = user;
  this.userOrders = [];

  // تحديث فوري عند فتح التفاصيل
  this.cdr.detectChanges();

  this.service.getOrders(user.id).subscribe(res => {
    this.userOrders = res;

    // 👇 بعد رجوع الأوردرز
    this.cdr.detectChanges();
  });
}


close() {
  this.selectedUser = null;
  this.userOrders = [];

  this.cdr.detectChanges();
}

}
