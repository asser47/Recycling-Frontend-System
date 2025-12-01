import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FlashMessageService } from '../../../core/services/flash-message.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule],  
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPasswordComponent {

  private flash = inject(FlashMessageService);
  private router = inject(Router);

  error: string | null = null;

  onSubmit(form: NgForm) {
    if (!form.valid) {
      this.error = "رجاء إدخال بريد إلكتروني صحيح";
      form.form.markAllAsTouched();
      return;
    }

    const email = form.value.email;

    // Mock لحد ما الباك يجهز
    setTimeout(() => {
      this.flash.showSuccess("تم إرسال رابط استعادة كلمة المرور ✔️");
      this.router.navigate(['/login']);
    }, 1000);
  }
  goToLogin() {
  this.router.navigate(['/login']);
}

}