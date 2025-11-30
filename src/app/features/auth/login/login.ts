import { Component, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NavbarComponent } from "../../../shared/components/navbar/navbar";
import { extractAuthError } from '../../../core/utils/auth-error.util';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [FormsModule, NavbarComponent]
})
export class LoginComponent {

  private auth = inject(AuthService);
  private router = inject(Router);

  error: string | null = null;

  onLogin(form: NgForm) {
    if (form.invalid) {
      this.error = "الرجاء إدخال بيانات صحيحة";
      form.form.markAllAsTouched();
      return;
    }

    this.auth.login(form.value).subscribe({
      next: (msg) => {
        alert(msg);
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.error = extractAuthError(err);
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
