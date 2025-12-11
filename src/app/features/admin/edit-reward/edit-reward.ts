import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RewardService } from '../../../core/services/reward.service';
import { FlashMessageService } from '../../../core/services/flash-message.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-reward',
  templateUrl: './edit-reward.html',
  styleUrls: ['./edit-reward.css'],
  imports: [CommonModule,ReactiveFormsModule,FormsModule]
})
export class EditRewardComponent implements OnInit {

  private service = inject(RewardService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private flash = inject(FlashMessageService);
  private router = inject(Router);

  rewardId!: number;
  imageFile: File | null = null;
  imagePreview: string | null = null;

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    category: ['', Validators.required],
    requiredPoints: [0, Validators.required],
    stockQuantity: [0, Validators.required],
    imageUrl: ['']
  });

  ngOnInit() {
    this.rewardId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadReward();
  }

loadReward() {
  this.service.getById(this.rewardId).subscribe(r => {
    this.form.patchValue(r);

    // هنا الحل
    this.imagePreview = this.formatImage(r.imageUrl ?? null);
  });
}


  onImageSelected(event: any) {
    const file = event.target.files[0];
    this.imageFile = file;

    const reader = new FileReader();
    reader.onload = () => (this.imagePreview = reader.result as string);
    reader.readAsDataURL(file);
  }

  updateReward() {
    if (this.form.invalid) {
      this.flash.showError("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("ID", this.rewardId.toString());
    formData.append("Name", this.form.value.name!);
    formData.append("Description", this.form.value.description!);
    formData.append("Category", this.form.value.category!);
    formData.append("RequiredPoints", this.form.value.requiredPoints!.toString());
    formData.append("StockQuantity", this.form.value.stockQuantity!.toString());
    formData.append("ImageUrl", this.form.value.imageUrl!);

    if (this.imageFile)
      formData.append("ImageFile", this.imageFile);

    this.service.update(this.rewardId, formData).subscribe(() => {
      this.flash.showSuccess("Reward updated successfully");
      this.router.navigate(['/admin/rewards']);
    });
  }

  formatImage(path: string | null | undefined): string {
  if (!path) return 'https://placehold.co/200?text=No+Image';
  if (path.startsWith('http')) return path;

  path = path.replace(/\\/g, '/').replace(/\/{2,}/g, '/');
  return `https://localhost:4375${path}`;
}

}
