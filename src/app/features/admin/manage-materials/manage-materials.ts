import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MaterialService } from '../../../core/services/material.service';
import { Material } from '../../../core/models/material.model';

@Component({
  standalone: true,
  selector: 'app-manage-materials',
  templateUrl: './manage-materials.html',
  styleUrls: ['./manage-materials.css'],
  imports: [CommonModule, FormsModule]
})
export class ManageMaterialsComponent implements OnInit {

  materials: Material[] = [];
  loading = false;
  error: string | null = null;

  newMaterial: Partial<Material> = { 
    typeName: '', 
    size: '', 
    price: 0, 
    factoryId: 1 
  };

  constructor(private materialService: MaterialService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;

    this.materialService.getAll().subscribe({
      next: (data) => {
        this.materials = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load materials';
        this.loading = false;
      }
    });
  }

  onCreate(f: NgForm) {
    if (!f.valid) {
      f.control.markAllAsTouched();
      return;
    }

    this.materialService.create(this.newMaterial).subscribe({
      next: (created) => {
        this.materials.unshift(created);
        f.resetForm({ typeName: '', size: '', price: 0, factoryId: 1 });
      },
      error: () => this.error = 'Failed to create'
    });
  }

  delete(id: number) {   // ← أهم تعديل
    if (!confirm('هل أنت متأكد؟')) return;

    this.materialService.delete(id).subscribe({
      next: () => {
        this.materials = this.materials.filter(m => m.id !== id);
      },
      error: () => this.error = 'Delete failed'
    });
  }

  trackById(index: number, item: Material) {
    return item.id;
  }
}
