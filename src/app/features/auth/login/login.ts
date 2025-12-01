import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NavbarComponent } from "../../../shared/components/navbar/navbar";
import { extractAuthError } from '../../../core/utils/auth-error.util';
import { FlashMessageService } from '../../../core/services/flash-message.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [FormsModule, NavbarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class LoginComponent {

  private auth = inject(AuthService);
  private router = inject(Router);
  private flash = inject(FlashMessageService);

  error: string | null = null;

  onLogin(form: NgForm) {
    if (form.invalid) {
      this.error = "الرجاء إدخال بيانات صحيحة";
      form.form.markAllAsTouched();
      return;
    }

    this.auth.login(form.value).subscribe({
      next: (token) => {

        // 👈 خزن التوكن
        this.auth.saveToken(token);

        this.flash.showSuccess("تم تسجيل الدخول بنجاح 🎉");
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.error = extractAuthError(err);
        this.flash.showError("خطأ في تسجيل الدخول");
      }
    });

  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToForgot() {
    this.router.navigate(['/forgot-password']);
  }
}
