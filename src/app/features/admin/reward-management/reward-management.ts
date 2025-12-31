import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { RewardService } from '../../../core/services/admin.services/adminreward.service';
import { Reward, RewardStats } from '../../../core/models/rewards/reward.model';

@Component({
  standalone: true,
  selector: 'app-reward-management',
  templateUrl: './reward-management.html',
  styleUrls: ['./reward-management.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class RewardManagementComponent implements OnInit {

  /* ================= INJECTIONS ================= */
  private rewardService = inject(RewardService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);


  /* ================= UI STATE ================= */
  activeTab: 'list' | 'create' | 'low' | 'stats' = 'list';
  isLoading = false;
  isUpdating = false;

  flashMessage: string | null = null;
  flashType: 'success' | 'error' = 'success';

  /* ================= DATA ================= */
  rewards: Reward[] = [];
  originalRewards: Reward[] = [];
  lowStockRewards: Reward[] = [];

  searchTerm = '';

  /* ================= EDIT / CREATE ================= */
  isEditMode = false;
  editingReward: Reward | null = null;

  selectedFile: File | null = null;
  imagePreview: string | null = null;

  /* ================= LOW STOCK ================= */
  selectedRewardId: number | null = null;
  restockAmount: number | null = null;

  /* ================= STATS ================= */
  stats: RewardStats | null = null;
  selectedReward: Reward | null = null;
  loadingStats = false;

  /* ================= FORM ================= */
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', Validators.required],
    category: ['', Validators.required],
    requiredPoints: [0, [Validators.required, Validators.min(1)]],
    stockQuantity: [0, [Validators.required, Validators.min(1)]],
  });

  /* ================= LIFECYCLE ================= */
  ngOnInit(): void {
    this.loadRewards();
  }

  /* ================= LOADERS ================= */
  loadRewards() {
    this.rewardService.getAll().subscribe(res => {
      this.rewards = res;
      this.originalRewards = [...res];
      this.cdr.detectChanges();
    });
  }

  loadLowStock() {
    const threshold = 10;

    this.rewardService.getAll().subscribe({
      next: res => {
        this.lowStockRewards = res.filter(r =>
          r.stockQuantity > 0 && r.stockQuantity <= threshold
        );
        this.selectedRewardId = null;
        this.restockAmount = null;
        this.cdr.detectChanges();
      },
      error: () => (this.lowStockRewards = [])
    });
  }

  /* ================= TABS ================= */
  setTab(tab: 'list' | 'create' | 'low' | 'stats') {
    this.activeTab = tab;
    this.stats = null;

    if (tab === 'list') this.loadRewards();
    if (tab === 'low') this.loadLowStock();
    if (tab === 'create' && !this.isEditMode) this.resetForm();
  }

  /* ================= IMAGE ================= */
  onImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.selectedFile = input.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(this.selectedFile);
  }

  /* ================= SUBMIT ================= */
  // ================= SUBMIT =================
submit() {
  if (this.form.invalid) {
    this.showFlash('Please fill all required fields', 'error');
    return;
  }

  // ❌ في create بس لازم صورة
  if (!this.isEditMode && !this.selectedFile) {
    this.showFlash('Please select image', 'error');
    return;
  }

  this.isLoading = true;

  const formData = new FormData();
  formData.append('Name', this.form.value.name!);
  formData.append('Description', this.form.value.description!);
  formData.append('Category', this.form.value.category!);
  formData.append('RequiredPoints', String(this.form.value.requiredPoints));
  formData.append('StockQuantity', String(this.form.value.stockQuantity));

  // ✅ ابعت صورة فقط لو المستخدم اختار واحدة جديدة
  if (this.selectedFile) {
    formData.append('ImageFile', this.selectedFile);
  }

  if (this.isEditMode && this.editingReward) {
    formData.append('ID', String(this.editingReward.id));

    this.rewardService.update(this.editingReward.id!, formData).subscribe({
      next: () => {
        this.showFlash('Reward updated successfully ✅', 'success');
        this.afterSubmit(true);
      },
      error: () => {
        this.isLoading = false;
        this.showFlash('❌ Error while updating reward', 'error');
      }
    });

  } else {
    this.rewardService.create(formData).subscribe({
      next: created => {
        this.rewards.unshift(created);
        this.originalRewards.unshift(created);
        this.showFlash('Reward created successfully ✅', 'success');
        this.afterSubmit(false);
      },
      error: () => {
        this.isLoading = false;
        this.showFlash('❌ Error while creating reward', 'error');
      }
    });
  }
}


  afterSubmit(reload: boolean) {
    this.resetForm();
    this.setTab('list');
    this.isLoading = false;
    if (reload) this.loadRewards();
  }

  resetForm() {
    this.form.reset();
    this.selectedFile = null;
    this.imagePreview = null;
    this.isEditMode = false;
    this.editingReward = null;
  }

  /* ================= ACTIONS ================= */
openEdit(reward: Reward) {
  this.isEditMode = true;
  this.editingReward = reward;
  this.activeTab = 'create';

  this.form.patchValue({
    name: reward.name,
    description: reward.description,
    category: reward.category,
    requiredPoints: reward.requiredPoints,
    stockQuantity: reward.stockQuantity
  });

  // ✅ عرض الصورة القديمة
  this.imagePreview = reward.imageUrl ?? null;

  // ✅ مهم جدًا
  this.selectedFile = null;
}


deleteReward(id: number) {
  this.rewardService.delete(id).subscribe({
    next: () => {
      this.showFlash('Reward deleted 🗑️', 'success');
      this.loadRewards();
    },
    error: () => {
      this.showFlash('❌ Failed to delete reward', 'error');
    }
  });
}


  updateStock() {
    if (!this.selectedRewardId || this.restockAmount === null || this.restockAmount < 0) {
      this.showFlash('Please enter a valid stock value', 'error');
      return;
    }

    this.isUpdating = true;

    this.rewardService.updateStock(this.selectedRewardId, this.restockAmount).subscribe({
      next: () => {
        this.showFlash('Stock updated successfully ✅', 'success');
        this.loadLowStock();
        this.loadRewards();
        this.selectedRewardId = null;
        this.restockAmount = null;
        this.isUpdating = false;
      },
      error: () => {
        this.showFlash('Failed to update stock ❌', 'error');
        this.isUpdating = false;
      }
    });
  }

  /* ================= STATS ================= */
loadStats(reward: Reward) {
  this.loadingStats = true;
  this.selectedReward = reward;

  this.rewardService.getStats(reward.id!).subscribe({
    next: (res) => {

      this.stats = {
        ...res,
        isAvailable: res.stockQuantity > 0
      };
      this.loadingStats = false;
      this.cdr.detectChanges();
    },
    error: () => {
      this.loadingStats = false;
    }
  });
}


  closeStats() {
    this.selectedReward = null;
    this.stats = null;
    // this.setTab('list');
  }

  /* ================= SEARCH ================= */
  search() {
    const term = this.searchTerm.trim().toLowerCase();
    this.rewards = term
      ? this.originalRewards.filter(r => r.name.toLowerCase().includes(term))
      : [...this.originalRewards];
  }

  resetSearch() {
    this.searchTerm = '';
    this.rewards = [...this.originalRewards];
  }

  /* ================= FLASH ================= */
  showFlash(message: string, type: 'success' | 'error') {
    this.flashMessage = message;
    this.flashType = type;

    setTimeout(() => {
      this.flashMessage = null;
      this.cdr.detectChanges();
    }, 3000);
  }

  cancelEdit() {
    this.resetForm();
    this.setTab('list');
  }
}
