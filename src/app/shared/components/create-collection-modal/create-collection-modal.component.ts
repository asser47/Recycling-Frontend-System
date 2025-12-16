import { Component, Input, Output, EventEmitter, inject, signal, computed, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LanguageService } from '../../../core/services/language.service';
import { DataService } from '../../../core/services/data.service';
import { CreateOrderDto, OrderDto } from '@core/models/order.model';
import { OrderService } from '@core/services/order.service';
import { MaterialService } from '../../../core/services/material.service';

interface MaterialItem {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-create-collection-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-collection-modal.component.html',
  styleUrl: './create-collection-modal.component.css'
})
export class CreateCollectionModalComponent implements OnChanges, OnInit {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();
  @Output() requestCreated = new EventEmitter<OrderDto>();

  private fb = inject(FormBuilder);
  languageService = inject(LanguageService);
  dataService = inject(DataService);
  orderService = inject(OrderService);
  materialService = inject(MaterialService);

  t = (key: string) => this.languageService.t(key);

  // Materials list loaded from service
  materials = signal<MaterialItem[]>([]);

  // Track selected materials and their weights
  private _selectedMaterialsMap = signal<Map<string, number>>(new Map());
  selectedMaterials = computed(() => {
    const selected = Array.from(this._selectedMaterialsMap().keys());
    return this.materials().filter(m => selected.includes(m.id));
  });

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    city: ['', Validators.required],
    street: ['', Validators.required],
    buildingNo: ['', Validators.required],
    apartment: ['']
  });

  ngOnInit(): void {
    // Load materials from service
    this.loadMaterials();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Reset form when modal opens
    if (changes['open'] && this.open) {
      setTimeout(() => {
        this.resetForm();
      }, 100);
    }
  }

  /**
   * Load materials from API
   */
  private loadMaterials(): void {
    this.materialService.getAll().subscribe({
      next: (apiMaterials) => {
        // Map API materials to MaterialItem format
        const materialItems: MaterialItem[] = apiMaterials.map(material => {
          const typeNameLower = material.typeName.toLowerCase();
          return {
            id: material.id.toString(),
            label: typeNameLower,
            icon: this.getMaterialIcon(typeNameLower)
          };
        });
        this.materials.set(materialItems);
        console.log('✅ Materials loaded from API:', materialItems);
      },
      error: () => {
        // Fallback to default materials if API fails
        this.materials.set([
          { id: 'plastic', label: 'plastic', icon: '♻️' },
          { id: 'paper', label: 'paper', icon: '📄' },
          { id: 'glass', label: 'glass', icon: '🍶' },
          { id: 'metal', label: 'metal', icon: '🔩' }
        ]);
      }
    });
  }

  /**
   * Get icon for material type
   */
  private getMaterialIcon(material: string): string {
    switch (material.toLowerCase()) {
      case 'plastic':
        return '♻️';
      case 'paper':
        return '📄';
      case 'glass':
        return '🍶';
      case 'metal':
      case 'can':
        return '🔩';
      default:
        return '🔄';
    }
  }

  isSelectedMaterial(materialId: string): boolean {
    return this._selectedMaterialsMap().has(materialId);
  }

  toggleMaterial(materialId: string): void {
    const currentMap = new Map(this._selectedMaterialsMap());
    if (currentMap.has(materialId)) {
      currentMap.delete(materialId);
    } else {
      currentMap.set(materialId, 0); // Default weight 0
    }
    this._selectedMaterialsMap.set(currentMap);
  }

  removeMaterial(materialId: string): void {
    const currentMap = new Map(this._selectedMaterialsMap());
    currentMap.delete(materialId);
    this._selectedMaterialsMap.set(currentMap);
  }

  getMaterialWeight(materialId: string): number {
    return this._selectedMaterialsMap().get(materialId) || 0;
  }

  setMaterialWeight(materialId: string, event: any): void {
    const weight = parseFloat(event.target.value) || 0;
    const currentMap = new Map(this._selectedMaterialsMap());
    currentMap.set(materialId, Math.max(0, weight)); // Ensure non-negative
    this._selectedMaterialsMap.set(currentMap);
  }

  getTotalWeight(): number {
    let total = 0;
    this._selectedMaterialsMap().forEach(weight => {
      total += weight;
    });
    return parseFloat(total.toFixed(2));
  }

  handleSubmit(): void {
    if (!this.form.valid || this.selectedMaterials().length === 0) return;

    const formValue = this.form.value;
    const selectedMaterials = this.selectedMaterials();

    // Get the first selected material as primary
    const primaryMaterial = selectedMaterials[0]?.id || 'mixed';

    // Create collection request object
    const request: CreateOrderDto = {
      email: formValue.email,
      typeOfMaterial: primaryMaterial,
      quantity: this.getTotalWeight(),
      city: formValue.city,
      street: formValue.street,
      buildingNo: formValue.buildingNo,
      apartment: formValue.apartment || '',
    };

    console.log('Submitting request:', request);
    console.log('Materials breakdown:', Object.fromEntries(this._selectedMaterialsMap()));

    // Add to DataService
    this.orderService.createOrder(request).subscribe({
      next: (order: OrderDto) => {
        // Emit event with the created order
        this.requestCreated.emit(order);
        this.close();
      },
      error: () => {
      }
    });
  }

  close(): void {
    this.open = false;
    this.openChange.emit(false);
  }

  private resetForm(): void {
    const currentUser = this.dataService.currentUser();
    this.form.patchValue({
      email: currentUser?.email || '',
      city: '',
      street: '',
      buildingNo: '',
      apartment: ''
    });
    // Clear selected materials
    this._selectedMaterialsMap.set(new Map());
  }
}
