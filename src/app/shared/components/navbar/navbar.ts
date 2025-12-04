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
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate([`/${path}`]);
  }

  isAuthPage() {
  return this.router.url.includes('login') || this.router.url.includes('register');
}

  logout() {
    this.router.navigate(['/login']);
  }
}
