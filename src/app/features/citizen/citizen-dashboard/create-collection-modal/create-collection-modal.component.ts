import { Component, Input, Output, EventEmitter, inject, signal, computed, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LanguageService } from '../../../../core/services/language.service';
import { DataService } from '../../../../core/services/data.service';
import { CreateOrderDto, OrderDto } from '@core/models/order.model';
import { OrderService } from '@core/services/order.service';
import { MaterialService } from '../../../../core/services/material.service';

interface MaterialItem {
  id: string;        // TypeName from backend: "Plastic", "Carton", "Can", "Glass"
  label: string;     // Display name (lowercase for translation)
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

  // Loading and error states
  isSubmitting = signal(false);
  submitError = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    city: ['', Validators.required],
    street: ['', Validators.required],
    buildingNo: ['', Validators.required],
    apartment: ['']
  });

  ngOnInit(): void {
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
        // Use typeName as ID (matches backend enum: "Plastic", "Carton", "Can", "Glass")
        const materialItems: MaterialItem[] = apiMaterials.map(material => {
          const typeName = material.typeName; // Keep original case from backend
          return {
            id: typeName,  // Use typeName like "Plastic", "Carton", "Can", "Glass"
            label: typeName.toLowerCase(),  // Display in lowercase for translation
            icon: this.getMaterialIcon(typeName)
          };
        });
        
        // Remove duplicates (in case same type appears multiple times)
        const uniqueMaterials = materialItems.filter((material, index, self) =>
          index === self.findIndex(m => m.id === material.id)
        );
        
        this.materials.set(uniqueMaterials);
        console.log('✅ Materials loaded from API:', uniqueMaterials);
      },
      error: (err) => {
        console.error('❌ Failed to load materials from API:', err);
        // Fallback to default materials matching backend MaterialType enum
        this.materials.set([
          { id: 'Plastic', label: 'plastic', icon: '♻️' },
          { id: 'Carton', label: 'carton', icon: '📄' },
          { id: 'Glass', label: 'glass', icon: '🍶' },
          { id: 'Can', label: 'can', icon: '🔩' }
        ]);
        console.log('⚠️ Using fallback materials');
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
      case 'carton':
      case 'paper':
      case 'cardboard':
        return '📄';
      case 'glass':
        return '🍶';
      case 'can':
      case 'metal':
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
    this.submitError.set(null); // Clear error when user makes changes
  }

  removeMaterial(materialId: string): void {
    const currentMap = new Map(this._selectedMaterialsMap());
    currentMap.delete(materialId);
    this._selectedMaterialsMap.set(currentMap);
    this.submitError.set(null);
  }

  getMaterialWeight(materialId: string): number {
    return this._selectedMaterialsMap().get(materialId) || 0;
  }

  setMaterialWeight(materialId: string, event: any): void {
    const weight = parseFloat(event.target.value) || 0;
    const currentMap = new Map(this._selectedMaterialsMap());
    currentMap.set(materialId, Math.max(0, weight)); // Ensure non-negative
    this._selectedMaterialsMap.set(currentMap);
    this.submitError.set(null);
  }

  getTotalWeight(): number {
    let total = 0;
    this._selectedMaterialsMap().forEach(weight => {
      total += weight;
    });
    return parseFloat(total.toFixed(2));
  }

  handleSubmit(): void {
    // Mark all form fields as touched to show validation errors
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });

    // Validate form
    if (!this.form.valid) {
      console.error('❌ Form is invalid');
      this.submitError.set(this.t('formInvalid') || 'Please fill all required fields correctly');
      return;
    }

    // Validate material selection
    if (this.selectedMaterials().length === 0) {
      console.error('❌ No materials selected');
      this.submitError.set(this.t('noMaterialsSelected') || 'Please select at least one material type');
      return;
    }

    // Validate total weight
    if (this.getTotalWeight() <= 0) {
      console.error('❌ Total weight must be greater than 0');
      this.submitError.set(this.t('invalidWeight') || 'Total weight must be greater than 0 kg');
      return;
    }

    const formValue = this.form.value;
    const selectedMaterials = this.selectedMaterials();

    // Get the first selected material as primary (backend supports one material per order)
    const primaryMaterial = selectedMaterials[0]?.id; // This will be "Plastic", "Carton", etc.

    // Create collection request object matching backend CreateOrderDto
    const request: CreateOrderDto = {
      email: formValue.email,
      typeOfMaterial: primaryMaterial,  // Sends "Plastic", "Carton", "Can", or "Glass"
      quantity: this.getTotalWeight(),
      city: formValue.city,
      street: formValue.street,
      buildingNo: formValue.buildingNo,
      apartment: formValue.apartment || '',
    };

    console.log('📤 Submitting order request:', request);
    console.log('📦 Materials breakdown:', Object.fromEntries(this._selectedMaterialsMap()));

    // Set loading state
    this.isSubmitting.set(true);
    this.submitError.set(null);

    // Submit to backend
    this.orderService.createOrder(request).subscribe({
      next: (order: OrderDto) => {
        console.log('✅ Order created successfully:', order);
        this.isSubmitting.set(false);
        
        // Emit event with the created order
        this.requestCreated.emit(order);
        
        // Close modal
        this.close();
      },
      error: (err) => {
        console.error('❌ Failed to create order:', err);
        this.isSubmitting.set(false);
        
        // Extract and display error message
        let errorMessage = this.t('orderCreationFailed') || 'Failed to create order. Please try again.';
        
        if (err.error?.message) {
          errorMessage = err.error.message;
        } else if (typeof err.error === 'string') {
          errorMessage = err.error;
        } else if (err.status === 400) {
          errorMessage = this.t('invalidData') || 'Invalid data provided. Please check all fields.';
        } else if (err.status === 404) {
          errorMessage = this.t('userNotFound') || 'User not found with the provided email.';
        } else if (err.status === 500) {
          errorMessage = this.t('serverError') || 'Server error. Please try again later.';
        }
        
        this.submitError.set(errorMessage);
      }
    });
  }

  close(): void {
    this.open = false;
    this.openChange.emit(false);
  }

  private resetForm(): void {
    const currentUser = this.dataService.currentUser();
    
    // Reset form values
    this.form.patchValue({
      email: currentUser?.email || '',
      city: '',
      street: '',
      buildingNo: '',
      apartment: ''
    });
    
    // Reset form state
    this.form.markAsUntouched();
    this.form.markAsPristine();
    
    // Clear selected materials
    this._selectedMaterialsMap.set(new Map());
    
    // Clear errors and loading state
    this.submitError.set(null);
    this.isSubmitting.set(false);
  }
}