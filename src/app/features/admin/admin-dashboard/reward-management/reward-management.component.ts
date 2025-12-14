import { Component, inject, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RewardService } from '../../../../core/services/reward.service';
import { FlashMessageService } from '../../../../core/services/flash-message.service';
import { RewardDto } from '../../../../core/models/dtos.model';

@Component({
  selector: 'app-reward-management',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reward-management.html',
  styleUrl: './reward-management.css'
})
export class RewardManagementComponent implements OnInit {
  private fb = inject(FormBuilder);
  private rewardService = inject(RewardService);
  private flashMessage = inject(FlashMessageService);

  isLoading = signal(false);
  isSubmitting = signal(false);
  error = signal<string | null>(null);
  rewards = signal<RewardDto[]>([]);
  showForm = signal(false);
  editingReward = signal<RewardDto | null>(null);
  selectedImage = signal<File | null>(null);
  imagePreview = signal<string | null>(null);
  stockUpdate: Record<number, number> = {};

  rewardForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', Validators.required],
    pointsRequired: [0, [Validators.required, Validators.min(1)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    category: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadRewards();
  }

  private loadRewards(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.rewardService.getAllRewards().subscribe({
      next: (rewards) => {
        this.rewards.set(rewards);
        this.isLoading.set(false);
      },
      error: (err) => {
        const message = err.error?.message || 'Failed to load rewards';
        this.error.set(message);
        this.isLoading.set(false);
      }
    });
  }

  showCreateForm(): void {
    this.editingReward.set(null);
    this.rewardForm.reset();
    this.selectedImage.set(null);
    this.imagePreview.set(null);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.rewardForm.reset();
    this.selectedImage.set(null);
    this.imagePreview.set(null);
  }

  editReward(reward: RewardDto): void {
    this.editingReward.set(reward);
    this.rewardForm.patchValue({
      name: reward.name,
      description: reward.description,
      pointsRequired: reward.pointsRequired || reward.requiredPoints || 0,
      stock: reward.stock || reward.stockQuantity || 0,
      category: reward.category
    });
    this.showForm.set(true);
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage.set(file);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview.set(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  submitRewardForm(): void {
    if (this.rewardForm.invalid) return;

    this.isSubmitting.set(true);
    const editing = this.editingReward();

    const formData = new FormData();
    formData.append('name', this.rewardForm.get('name')?.value || '');
    formData.append('description', this.rewardForm.get('description')?.value || '');
    formData.append('pointsRequired', String(this.rewardForm.get('pointsRequired')?.value || 0));
    formData.append('stock', String(this.rewardForm.get('stock')?.value || 0));
    formData.append('category', this.rewardForm.get('category')?.value || '');

    if (this.selectedImage()) {
      formData.append('image', this.selectedImage()!);
    }

    const request = editing
      ? this.rewardService.updateReward(editing.id, formData)
      : this.rewardService.createReward(formData);

    request.subscribe({
      next: () => {
        this.flashMessage.showSuccess(
          editing ? 'Reward updated successfully' : 'Reward created successfully'
        );
        this.closeForm();
        this.loadRewards();
        this.isSubmitting.set(false);
      },
      error: (err) => {
        const message = err.error?.message || 'Failed to save reward';
        this.flashMessage.showError(message);
        this.isSubmitting.set(false);
      }
    });
  }

  updateStock(reward: RewardDto): void {
    const newStock = this.stockUpdate[reward.id];
    if (newStock === undefined) return;

    this.rewardService.updateRewardStock(reward.id, newStock).subscribe({
      next: () => {
        this.flashMessage.showSuccess('Stock updated successfully');
        this.loadRewards();
      },
      error: (err) => {
        const message = err.error?.message || 'Failed to update stock';
        this.flashMessage.showError(message);
      }
    });
  }

  deleteReward(reward: RewardDto): void {
    if (!confirm(`Delete reward "${reward.name}"?`)) return;

    this.rewardService.deleteReward(reward.id).subscribe({
      next: () => {
        this.flashMessage.showSuccess('Reward deleted successfully');
        this.loadRewards();
      },
      error: (err) => {
        const message = err.error?.message || 'Failed to delete reward';
        this.flashMessage.showError(message);
      }
    });
  }
}
