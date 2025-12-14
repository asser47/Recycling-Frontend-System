import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-admin-layout',
  templateUrl: './admin-navbar.html',
  styleUrls: ['./admin-navbar.css'],
  imports: [CommonModule, RouterModule]
})
export class AdminNavbarComponent {

  constructor(
    private router: Router,
    private auth: AuthService
  ) { }

  go(path: string) {
    this.router.navigate(['admin', path]);
  }

  isActive(path: string): boolean {
    return this.router.url.includes(path);
  }

  isAdmin(): boolean {
    return this.auth.getRole() === 'Admin';
  }

  logoutAdmin() {
    this.auth.logout();  // ← شغالة 100%
  }
  goToHome() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
