import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FactoryService } from '../../../core/services/factory.services/factory.service';
import { AuthService } from '../../../core/services/auth.services/auth.service';
import { Factory } from '../../../core/models/factories/factory.model';
import { Role } from '../../../core/models/users/role.enum';

@Component({
  standalone: true,
  selector: 'app-manage-factories',
  templateUrl: './manage-factories.html',
  styleUrls: ['./manage-factories.css'],
  imports: [CommonModule, FormsModule]
})
export class ManageFactoriesComponent implements OnInit {

  private service = inject(FactoryService);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  factories: Factory[] = [];

  selectedFactory: any | null = null;
  currentOrderIndex = 0;

  showForm = false;
  editing = false;

  form: Factory = {
    id: 0,
    name: '',
    location: ''
  };

  searchText = '';

  ngOnInit() {
    this.load();
  }

  // ================= LOAD =================
  load() {
    this.service.getAll().subscribe(res => {
      this.factories = res;

      // 👇 تحديث الـ UI بعد تحميل الداتا
      this.cdr.detectChanges();
    });
  }

  // ================= SEARCH =================
  search() {
    if (!this.searchText.trim()) {
      this.load();
      return;
    }

    this.service.search(this.searchText).subscribe(res => {
      this.factories = res;

      // 👇 تحديث بعد البحث
      this.cdr.detectChanges();
    });
  }

  onSearchChange() {
    if (!this.searchText.trim()) {
      this.load();
    }
  }

  // ================= VIEW =================
  showDetails(id: number) {
    // اقفل أي مودال تاني
    this.showForm = false;
    this.editing = false;
    this.selectedFactory = null;
    this.currentOrderIndex = 0;

    // 👇 تحديث فوري قبل الريكوست
    this.cdr.detectChanges();

    this.service.getDetails(id).subscribe(res => {
      this.selectedFactory = res;

      // 👇 مهم جدًا لظهور المودال من أول Click
      this.cdr.detectChanges();
    });
  }

  closeFactory() {
    this.selectedFactory = null;
    this.currentOrderIndex = 0;

    // 👇 تحديث بعد الغلق
    this.cdr.detectChanges();
  }

  // ================= ORDER SLIDER =================
  nextOrder() {
    if (this.selectedFactory?.orders && this.selectedFactory.orders.length > 0) {
      this.currentOrderIndex = (this.currentOrderIndex + 1) % this.selectedFactory.orders.length;
    }
  }

  prevOrder() {
    if (this.selectedFactory?.orders && this.selectedFactory.orders.length > 0) {
      this.currentOrderIndex = (this.currentOrderIndex - 1 + this.selectedFactory.orders.length) % this.selectedFactory.orders.length;
    }
  }

  goToOrder(index: number) {
    this.currentOrderIndex = index;
  }

  // ================= ADD / EDIT =================
  startAdd() {
    this.selectedFactory = null;
    this.editing = false;
    this.showForm = true;
    this.form = { id: 0, name: '', location: '' };

    this.cdr.detectChanges();
  }

  startEdit(factory: Factory) {
    this.selectedFactory = null;
    this.editing = true;
    this.showForm = true;
    this.form = { ...factory };

    this.cdr.detectChanges();
  }

  save() {
    if (!this.isAdmin()) return;

    const action$ = this.editing
      ? this.service.update(this.form)
      : this.service.create(this.form);

    action$.subscribe(() => {
      this.load();
      this.closeForm();
    });
  }

  closeForm() {
    this.showForm = false;
    this.editing = false;

    this.cdr.detectChanges();
  }

  // ================= DELETE =================
  delete(id: number) {
    if (!this.isAdmin()) return;

    if (!confirm('Are you sure you want to delete this factory?')) return;

    this.service.delete(id).subscribe(() => {
      this.load();
    });
  }

  // ================= ROLE =================
  isAdmin(): boolean {
    return this.auth.getRole() === Role.Admin;
  }
}
