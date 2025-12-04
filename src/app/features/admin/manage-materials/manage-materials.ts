import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialService } from '../../../core/services/material.service';
import { AuthService } from '../../../core/services/auth.service';
import { Material } from '../../../core/models/material.model';
import { NgZone, ChangeDetectorRef } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-manage-materials',
  templateUrl: './manage-materials.html',
  styleUrls: ['./manage-materials.css'],
  imports: [CommonModule, FormsModule]
})
export class ManageMaterialsComponent {

  private service = inject(MaterialService);
  public auth = inject(AuthService);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  materials: Material[] = [];
  searchText = '';

  form: Material = {
    id: 0,
    typeName: '',
    size: '',
    price: 0
  };

  editing = false;
  showForm = false;

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.getAll().subscribe(res => {
      this.zone.run(() => {
        this.materials = res;
        this.cdr.detectChanges();
      });
    });
  }
  isAdmin() {
    return this.auth.getRole() === 'Admin';
  }

  search() {
    if (!this.searchText.trim()) {
      this.load();
      return;
    }

    this.service.search(this.searchText).subscribe(res => {
      this.zone.run(() => {
        this.materials = res;
        this.cdr.detectChanges();
      });
    });
  }

  onSearchChange() {
  if (!this.searchText.trim()) {
    this.load();
  }
  }

  startAdd() {
    this.editing = false;
    this.showForm = true;
    this.form = { id: 0, typeName: '', size: '', price: 0 };
  }

  startEdit(m: Material) {
    this.editing = true;
    this.showForm = true;
    this.form = { ...m };
  }

  save() {
    if (!this.isAdmin()) return;

    if (this.editing) {
      this.service.update(this.form.id, this.form).subscribe(() => {
        this.load();
        this.showForm = false;
        this.startAdd();
      });
    } else {
      this.service.create(this.form).subscribe(() => {
        this.load();
        this.showForm = false;
        this.startAdd();
      });
    }
  }


  delete(id: number) {
    if (!this.isAdmin()) return;
    this.service.delete(id).subscribe(() => this.load());
  }
  cancel() {
    this.showForm = false;
    this.editing = false;
  }
}
