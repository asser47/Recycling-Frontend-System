import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RewardService } from '../../../core/services/reward.service';
import { Reward } from '../../../core/models/reward.model';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlashMessageService } from '../../../core/services/flash-message.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-reward-management',
  templateUrl: './reward-management.html',
  styleUrls: ['./reward-management.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class RewardManagementComponent implements OnInit {
  private rewardService = inject(RewardService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  flash = inject(FlashMessageService);

  activeTab: string = 'list';
  rewards: Reward[] = [];
  originalRewards: Reward[] = [];
  lowStockRewards: Reward[] = [];
  stats: any = null;

  selectedRewardId: number | null = null;
  restockAmount = 0;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.maxLength(200)]],
    category: ['', Validators.required],
    requiredPoints: [0, [Validators.required, Validators.min(10)]],
    stockQuantity: [0, [Validators.required, Validators.min(1)]],
    imageUrl: ['']
  });

  searchTerm = '';
  imageFile: File | null = null;
  imagePreview: string | null = null;

  ngOnInit(): void {
    this.loadRewards();
  }

  // ------------------ TABS -------------------
setTab(tab: string) {
  this.activeTab = tab;

  switch (tab) {
    case 'list':
      this.loadRewards();
      break;
    case 'create':
      break;
    case 'low':
      this.loadLowStock();
      break;
    case 'stats':
      this.loadRewards();
      break;
    case 'popular':
      this.loadPopular();
      break;
  }

  setTimeout(() => this.cdr.detectChanges(), 0);
}


  // ------------------ LOAD DATA -------------------
  loadRewards() {
    this.rewardService.getAll().subscribe(res => {
      this.rewards = [...res];
      this.originalRewards = [...res];
      this.cdr.detectChanges();
    });
  }

  loadLowStock() {
    this.rewardService.getLowStock().subscribe(res => {
      this.lowStockRewards = [...res];
      this.cdr.detectChanges();
    });
  }

  loadStats(id: number) {
    this.selectedRewardId = id;
    this.rewardService.getStats(id).subscribe(res => {
      this.stats = { ...res };
      this.cdr.detectChanges();
    });
  }

  // ------------------ SEARCH -------------------
  search() {
    if (!this.searchTerm.trim()) {
      this.rewards = [...this.originalRewards];
      this.cdr.detectChanges();
      return;
    }

    this.rewards = this.originalRewards.filter(r =>
      r.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    this.cdr.detectChanges();
  }

  resetSearch() {
    this.searchTerm = '';
    this.rewards = [...this.originalRewards];
    this.cdr.detectChanges();
  }

  // ------------------ CREATE -------------------
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.imageFile = file;

    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result as string;
    reader.readAsDataURL(file);

    this.cdr.detectChanges();
  }

submit() {
  if (this.form.invalid) {
    this.flash.showError("Please fill all fields correctly.");
    this.form.markAllAsTouched();
    return;
  }

  if (!this.imageFile) {
    this.flash.showError("Please upload an image.");
    return;
  }

  const formData = new FormData();
  formData.append("Name", this.form.value.name!);
  formData.append("Description", this.form.value.description!);
  formData.append("Category", this.form.value.category!);
  formData.append("RequiredPoints", this.form.value.requiredPoints!.toString());
  formData.append("StockQuantity", this.form.value.stockQuantity!.toString());
  formData.append("ImageFile", this.imageFile);

  this.rewardService.create(formData).subscribe(() => {
    this.flash.showSuccess("Reward Created Successfully");
    this.form.reset();
    this.imageFile = null;
    this.imagePreview = null;
    this.setTab('list');
  });
}



  // ------------------ STOCK UPDATE -------------------
  updateStock() {
    if (!this.selectedRewardId || this.restockAmount <= 0) return;

    this.rewardService.updateStock(this.selectedRewardId, this.restockAmount).subscribe(() => {
this.flash.showSuccess("Reward updated Successfully");
      this.restockAmount = 0;
      this.selectedRewardId = null;

      this.loadLowStock();
      this.loadRewards();
    });
  }

  // ------------------ IMAGE -------------------
  formatImage(path: string | null | undefined): string {
    if (!path) return 'https://placehold.co/200?text=No+Image';
    if (path.startsWith('http')) return path;

    path = path.replace(/\\/g, '/').replace(/\/{2,}/g, '/');
    return `https://localhost:4375${path}`;
  }

  onImageError(event: any) {
    event.target.src = 'https://placehold.co/200?text=No+Image';
  }
loadPopular() {
  this.rewardService.getPopular().subscribe(res => {
    this.rewards = [...res];
    this.cdr.detectChanges();
  });
}

deleteReward(id: number) {
  if (!id) return;

  this.rewardService.delete(id).subscribe(() => {
this.flash.showSuccess("Reward Deleted Successfully");

    // Refresh Lists
    this.loadRewards();
    this.loadLowStock();
  });
}
updateStockInline() {
  if (!this.selectedRewardId) return;

  if (!this.restockAmount || this.restockAmount <= 0) {
    this.flash.showError("Amount must be greater than 0");
    return;
  }

  this.rewardService.updateStock(this.selectedRewardId, this.restockAmount).subscribe(() => {
    this.flash.showSuccess("Stock Updated Successfully");
    this.restockAmount = 0;
    this.selectedRewardId = null;
    this.loadLowStock();
    this.loadRewards();
  });
}

goToEdit(id: number) {
  this.router.navigate(['/admin/rewards/edit', id]);

}
}
