import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { NavbarComponent } from "../../../shared/components/navbar/navbar";

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [CommonModule, FormsModule, NavbarComponent]
})
export class RegisterComponent {
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  async onRegister(f: NgForm) {
    if (!f.valid) return;

    try {
      await this.auth.register(f.value);
      this.router.navigate(['/materials']);
    } catch {
      this.error = 'هذا البريد مستخدم من قبل';
    }
  }
  goToLogin() {
  this.router.navigate(['/login']);
}

}
