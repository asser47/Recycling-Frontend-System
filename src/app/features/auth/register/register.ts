import { Component, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FlashMessageService } from '../../../core/services/flash-message.service';
import { ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [CommonModule, FormsModule]
})
export class RegisterComponent {

  private auth = inject(AuthService);
  private router = inject(Router);
  private flash = inject(FlashMessageService);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  error: string | null = null;
  isLoading = false;

onRegister(form: NgForm) {

  this.error = null;

  if (form.invalid) {
    this.flash.showError('Please complete the fields ❌');
    return;
  }

  if (form.value.password !== form.value.confirmPassword) {
    this.flash.showError('The passwords do not match ❌');
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

        // Identity validation errors
        if (err.status === 400 && Array.isArray(err.error)) {

          const codes: string[] = err.error.map(
            (e: { code: string }) => e.code
          );

          if (codes.includes('DuplicateEmail')) {
            this.flash.showError('This email is already registered ❌');
          }
          else if (codes.includes('DuplicateUserName')) {
            this.flash.showError('This username is already taken ❌');
          }
          else {
            this.flash.showError('Invalid registration data ❌');
          }

        } else {
          this.flash.showError('Unexpected error occurred ❌');
        }

        this.cdr.detectChanges();
      });
    }
  });
}


  goToLogin() {
    this.router.navigate(['/login']);
  }

  clearError() {
    this.error = null;
    this.cdr.detectChanges();
  }

  isRegister() {
    return this.router.url.includes('register');
  }
}
