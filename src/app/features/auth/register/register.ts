import { Component, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NavbarComponent } from "../../../shared/components/navbar/navbar";
import { extractAuthError } from '../../../core/utils/auth-error.util';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [FormsModule, NavbarComponent]
})
export class RegisterComponent {

  private auth = inject(AuthService);
  private router = inject(Router);

  error: string | null = null;

  onRegister(form: NgForm) {
    if (!form.valid) {
      this.error = "الرجاء ملء جميع الحقول بشكل صحيح";
      form.form.markAllAsTouched();
      return;
    }

    const payload = form.value;

    this.auth.register(payload).subscribe({
      next: (msg) => {
        alert(msg);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = extractAuthError(err);
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
