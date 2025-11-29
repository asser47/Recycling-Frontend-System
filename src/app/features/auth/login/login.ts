import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { NavbarComponent } from "../../../shared/components/navbar/navbar";

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [CommonModule, FormsModule, NavbarComponent]
})
export class LoginComponent {

  error: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  async onLogin(f: NgForm) {
    if (!f.valid) return;
    try {
      await this.auth.login(f.value.email, f.value.password);
      this.router.navigate(['/materials']);
    } catch (e) {
      this.error = 'البريد أو كلمة المرور غير صحيحة';
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
