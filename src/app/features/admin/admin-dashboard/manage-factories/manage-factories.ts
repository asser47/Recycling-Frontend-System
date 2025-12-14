import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FactoryService } from '../../../../core/services/factory.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Factory } from '../../../../core/models/factory.model';
import { NgZone, ChangeDetectorRef } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-manage-factories',
  templateUrl: './manage-factories.html',
  styleUrls: ['./manage-factories.css'],
  imports: [CommonModule, FormsModule]
})
export class ManageFactoriesComponent {

  private service = inject(FactoryService);
  public auth = inject(AuthService);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  factories: Factory[] = [];
  details: any = null;

  form: Factory = {
    id: 0,
    name: '',
    location: ''
  };

  editing = false;
  showForm = false;
  searchText: any;

  ngOnInit() {
    this.load();
  }

  /** ===========================
   *  LOAD DATA IMMEDIATELY
   * =========================== */
  load() {
    this.service.getAll().subscribe(res => {
      this.zone.run(() => {
        this.factories = res;
        this.details = null;
        this.cdr.detectChanges();
      });
    });
  }

  /** ===========================
   *  SEARCH & AUTOMATIC RETURN
   * =========================== */
  search() {
    if (!this.searchText || !this.searchText.trim()) {
      this.load();
      return;
    }

    this.service.search(this.searchText).subscribe(res => {
      this.zone.run(() => {
        this.factories = res;
        this.cdr.detectChanges();
      });
    });
  }

  onSearchChange() {
    if (!this.searchText || !this.searchText.trim()) {
      this.load();
    }
  }

  /** ===========================
   *  START ADD / EDIT
   * =========================== */
  startAdd() {
    this.editing = false;
    this.showForm = true;
    this.form = { id: 0, name: '', location: '' };
    this.details = null;
  }

  startEdit(factory: Factory) {
    this.editing = true;
    this.showForm = true;
    this.form = { ...factory };
    this.details = null;
  }

  /** ===========================
   *  SAVE (ADD + EDIT)
   * =========================== */
  save() {
    if (!this.isAdmin()) return;

    if (this.editing) {
      this.service.update(this.form).subscribe(() => {
        this.zone.run(() => {
          this.load();
          this.showForm = false;
          this.cdr.detectChanges();
        });
      });
    } else {
      this.service.create(this.form).subscribe(() => {
        this.zone.run(() => {
          this.load();
          this.showForm = false;
          this.cdr.detectChanges();
        });
      });
    }
  }

  /** ===========================
   *  DELETE FACTORY
   * =========================== */
  delete(id: number) {
    if (!this.isAdmin()) return;

    this.service.delete(id).subscribe(() => {
      this.zone.run(() => {
        this.load();
        this.cdr.detectChanges();
      });
    });
  }

  /** ===========================
   *  VIEW DETAILS (WITHOUT DELAY)
   * =========================== */
  showDetails(id: number) {
    this.showForm = false;
    this.editing = false;

    this.service.getDetails(id).subscribe(res => {
      this.zone.run(() => {
        this.details = res;
        this.cdr.detectChanges();
      });
    });
  }

  /** ===========================
   *  CANCEL
   * =========================== */
  cancel() {
    this.showForm = false;
    this.editing = false;
    this.details = null;
  }

  isAdmin() {
    return this.auth.getRole() === 'Admin';
  }
}
