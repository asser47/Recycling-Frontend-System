import { Component, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.services/auth.service';
import { FlashMessageService } from '../../../core/services/flash-message.service';
import { ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.dark]': 'isDarkMode()' }
})
export class RegisterComponent {

  private auth = inject(AuthService);
  private router = inject(Router);
  private flash = inject(FlashMessageService);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);
  private themeService = inject(ThemeService);

  isDarkMode = computed(() => this.themeService.theme() === 'dark');

  error: string | null = null;
  isLoading = false;

  onRegister(form: NgForm) {

    this.error = null;

    if (form.invalid) {
      this.error = 'Please complete all required fields.';
      return;
    }

    if (form.value.password !== form.value.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    const payload = {
      fullName: form.value.fullName,
      email: form.value.email,
      phoneNumber: form.value.phoneNumber,
      password: form.value.password,
      confirmPassword: form.value.confirmPassword,
      city: form.value.city,
      street: form.value.street,
      buildingNo: String(form.value.buildingNo),
      apartment: form.value.apartment
    };

    this.isLoading = true;

    this.auth.register(payload).subscribe({

      next: () => {
        this.zone.run(() => {
          this.isLoading = false;
          this.flash.showSuccess('Account created successfully ✔');

          setTimeout(() => {
            this.router.navigate(['/register-success']);
          }, 1200);
        });
      },

      error: (err) => {
        this.zone.run(() => {
          this.isLoading = false;

          let errors: any[] | null = null;

          // 🟢 الحالة 1: الرد object
          if (err.error && typeof err.error === 'object' && err.error.errors) {
            errors = err.error.errors;
          }

          // 🟡 الحالة 2: الرد string (JSON)
          else if (typeof err.error === 'string') {
            try {
              const parsed = JSON.parse(err.error);
              if (parsed.errors && Array.isArray(parsed.errors)) {
                errors = parsed.errors;
              }
            } catch {
              // ignore
            }
          }

          if (errors && errors.length > 0) {

            if (errors.some(e => e.code === 'DuplicateEmail')) {
              this.error = 'This email is already registered.';
            }
            else if (errors.some(e => e.code === 'DuplicateUserName')) {
              this.error = 'This username is already taken.';
            }
            else if (errors.some(e => e.code === 'PasswordMismatch')) {
              this.error = 'Passwords do not match.';
            }
            else {
              this.error = errors[0].description;
            }

          } else {
            this.error = 'Unexpected error occurred. Please try again.';
          }

          this.cdr.detectChanges();
        });
      }
    });
  }

  clearError() {
    if (this.error) {
      this.error = null;
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
