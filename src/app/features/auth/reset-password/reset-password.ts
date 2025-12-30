import { Component, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.services/auth.service';
import { FlashMessageService } from '../../../core/services/flash-message.service';
import { ChangeDetectorRef, NgZone } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.dark]': 'isDarkMode()' }
})
export class ResetPasswordComponent {

  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private flash = inject(FlashMessageService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);
  private themeService = inject(ThemeService);

  isDarkMode = computed(() => this.themeService.theme() === 'dark');

  email: string | null = null;
  token: string | null = null;
  error: string | null = null;
  isLoading = false;

  ngOnInit() {
  this.email = this.route.snapshot.queryParamMap.get('email');
  const rawToken = this.route.snapshot.queryParamMap.get('token');

  this.token = rawToken ? decodeURIComponent(rawToken) : null;

  if (!this.email || !this.token) {
    this.error = "Invalid or expired link ❌";
    this.cdr.detectChanges();
  }
}


  onReset(form: NgForm) {

    if (form.invalid) {
      this.error = "Please enter all the data";
      this.cdr.detectChanges();
      return;
    }

    if (form.value.newPassword !== form.value.confirmPassword) {
      this.error = "The passwords do not match ❌";
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges();

    const data = {
      email: this.email!,
      token: this.token!,   // 👈 raw token
      newPassword: form.value.newPassword,
      confirmPassword: form.value.confirmPassword
    };

    this.auth.resetPassword(data).subscribe({
      next: () => {
        this.flash.showSuccess("Password changed successfully ✔");

        this.zone.run(() => {
          setTimeout(() => {
            this.isLoading = false;
            this.router.navigate(['/login']);
            this.cdr.detectChanges();
          }, 1500);
        });
      },
      error: () => {
        this.isLoading = false;
        this.error = "An error occurred while changing the password ❌";
        this.cdr.detectChanges();
      }
    });
  }
}
