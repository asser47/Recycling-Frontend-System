import { Component, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NavbarComponent } from "../../../shared/components/navbar/navbar";
import { FlashMessageService } from '../../../core/services/flash-message.service';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [CommonModule,FormsModule, NavbarComponent]
})
export class RegisterComponent {

  private auth = inject(AuthService);
  private router = inject(Router);
  private flash = inject(FlashMessageService);
  private cdr = inject(ChangeDetectorRef);

  error: string | null = null;

  onRegister(form: NgForm) {

  this.error = null;

  // 1) Check validation
  if (form.invalid) {
    this.error = "Please complete the fields.";
    form.form.markAllAsTouched();
    return;
  }

  //  2) Check password match
  if (form.value.password !== form.value.confirmPassword) {
    this.error = "The passwords do not match ❌";
    return;
  }

  //  3) Request
  this.auth.register(form.value).subscribe({
    next: () => {
      this.flash.showSuccess("Account created successfully ✔");
      this.router.navigate(['/login']);
    },

    error: (err) => {
      if (err.status === 400) {
        this.error = "This email is already registered ❌";
        this.flash.showError("This email is pre-registered");
        return;
      }

      this.error = "An unexpected error occurred.";
      this.flash.showError("An unexpected error occurred.");
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
