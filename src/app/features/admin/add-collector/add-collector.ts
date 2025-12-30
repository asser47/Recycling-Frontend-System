import { ChangeDetectorRef, Component, inject, NgZone } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CollectorService } from '../../../core/services/collector.sevices/collector.service';
import { FlashMessageService } from '../../../core/services/flash-message.service';
import { Router } from '@angular/router';
import { HireCollectorDto } from '../../../core/models/collectors/HireCollectorDto.model';

@Component({
  selector: 'app-add-collector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-collector.html',
  styleUrls: ['./add-collector.css']
})
export class AddCollectorComponent {

  private service = inject(CollectorService);
  private flash = inject(FlashMessageService);
  private router = inject(Router);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  isLoading = false;
error = '';

  onSubmit(form: NgForm) {

    if (form.invalid) {
      this.error = 'Please fill all required fields';
      this.flash.showError(this.error);
      return;
    }

    const payload: HireCollectorDto = {
      fullName: form.value.fullName?.trim(),
      email: form.value.email?.trim(),
      password: form.value.password,

      phoneNumber: form.value.phoneNumber || null,
      city: form.value.city || null,
      street: form.value.street || null,
      buildingNo: form.value.buildingNo || null,
      apartment: form.value.apartment || null,
    };

    this.isLoading = true;
    this.error = '';

    this.service.hireCollector(payload).subscribe({
      next: () => {
        this.zone.run(() => {
          this.isLoading = false;
          this.flash.showSuccess('Collector hired successfully ✔');
          this.router.navigate(['/admin/collectors']);
          this.cdr.detectChanges();
        });
      },

      error: (err) => {
        this.zone.run(() => {
          this.isLoading = false;

          // Email already exists
          if (err.status === 400 || err.status === 409) {
            this.error = err.error?.error || 'Email already exists ❌';
            this.flash.showError(this.error);
            this.cdr.detectChanges();
            return;
          }

          // Unauthorized (token expired)
          if (err.status === 401) {
            this.error = 'Session expired, please login again';
            this.flash.showError(this.error);
            this.router.navigate(['/login']);
            return;
          }

          // Any other error
          this.error = 'Failed to hire collector ❌';
          this.flash.showError(this.error);
          this.cdr.detectChanges();
        });
      }
    });
  }
}
