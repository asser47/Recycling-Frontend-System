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
    this.error = "Please enter correct information.";
    form.form.markAllAsTouched();
    return;
  }

  this.auth.login(form.value).subscribe({
    next: (token) => {
      this.auth.saveToken(token);
      this.flash.showSuccess("Successful login 🎉");
      this.router.navigate(['/admin/dashboard']);
    },
    error: (err) => {
      const msg = extractAuthError(err) || "Incorrect email or password";
      this.error = msg;
      this.flash.showError(msg);
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
