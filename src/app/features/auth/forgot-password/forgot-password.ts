import { Component, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FlashMessageService } from '../../../core/services/flash-message.service';
import { AuthService } from '../../../core/services/auth.services/auth.service';
import { ChangeDetectorRef, NgZone } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.dark]': 'isDarkMode()' }
})
export class ForgotPasswordComponent {

  private flash = inject(FlashMessageService);
  private router = inject(Router);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);
  private themeService = inject(ThemeService);

  isDarkMode = computed(() => this.themeService.theme() === 'dark');

  error: string | null = null;
  isLoading = false;

  onSubmit(form: NgForm) {
    if (!form.valid) {
      this.error = "Please provide a valid email address.";
      form.form.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    this.error = null;
    const email = form.value.email;

    this.isLoading = true;
    this.cdr.detectChanges();

    this.auth.forgotPassword(email).subscribe({
  next: () => {
    this.error = null;
    this.flash.showSuccess("Password reset link sent ✔");

    this.zone.run(() => {
      setTimeout(() => {
        this.isLoading = false;
        this.router.navigate(['/login']);
        this.cdr.detectChanges();
      }, 1300);
    });
  },
  error: () => {
    this.isLoading = false;
    this.error = "Mail not found ❌";
    this.cdr.detectChanges();
  }
});

  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
