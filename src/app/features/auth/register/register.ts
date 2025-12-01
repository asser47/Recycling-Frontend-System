import { Component, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NavbarComponent } from "../../../shared/components/navbar/navbar";
import { FlashMessageService } from '../../../core/services/flash-message.service';

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
  private flash = inject(FlashMessageService);

  error: string | null = null;

  onRegister(form: NgForm) {

  this.error = null;

  // 🟥 1) Check validation
  if (form.invalid) {
    this.error = "رجاء اكتمال الحقول";
    form.form.markAllAsTouched();
    return;
  }

  // ⛔ 2) Check password match
  if (form.value.password !== form.value.confirmPassword) {
    this.error = "كلمتا المرور غير متطابقتين ❌";
    return;
  }

  // 🟩 3) Request
  this.auth.register(form.value).subscribe({
    next: () => {
      this.flash.showSuccess("تم إنشاء الحساب بنجاح ✔");
      this.router.navigate(['/login']);
    },

    error: (err) => {
      if (err.status === 400) {
        this.error = "هذا البريد مسجل مسبقًا ❌";
        this.flash.showError("هذا البريد مسجل مسبقًا");
        return;
      }

      this.error = "حدث خطأ غير متوقع";
      this.flash.showError("حدث خطأ غير متوقع");
    }
  });

}
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
