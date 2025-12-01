import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  imports: [CommonModule]
})
export class NavbarComponent {

  constructor(
    public auth: AuthService, 
    private router: Router
  ) {}

  goTo(path: string) {

    // 🔥 لو ما بعتش Path → روح للهوم
    if (!path) {
      this.router.navigate(['/']);
      return;
    }

    this.router.navigate([`/${path}`]);
  }

  logout() {
    this.auth.logout();

    // 🔥 مهم جدًا بعد Logout → تنقل للّوجين
    this.router.navigate(['/login']);
  }
}
