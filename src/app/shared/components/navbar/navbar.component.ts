import { Component, inject, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { ThemeService } from '../../../core/services/theme.service';
import { LanguageService } from '../../../core/services/language.service';
import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { DataService } from '../../../core/services/data.service';
import { UserDataService } from '../../../core/services/user-data.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  // ================= INJECTS =================
  router = inject(Router);
  themeService = inject(ThemeService);
  languageService = inject(LanguageService);
  userService = inject(UserService);
  notificationService = inject(NotificationService);
  authService = inject(AuthService);
  dataService = inject(DataService);
  userDataService = inject(UserDataService);

  // ================= UI STATE =================
  showUserMenu = signal(false);
  showNotificationsDropdown = signal(false);

  // ================= COMPUTED =================
  isLoggedIn = () => this.authService.isLogged();
isAdmin = computed(() => {
  return this.userService.currentRole()?.toLowerCase() === 'admin';
});

  userPoints = computed(() =>
    this.dataService.currentUser()?.points ?? 0
  );

  unreadNotifications = this.notificationService.unreadCount;

  userData = this.userDataService.userData;

  displayName = computed(() =>
    this.userData()?.fullName ||
    this.dataService.currentUser()?.name ||
    'User'
  );

  isAuthRoute = computed(() => {
    const url = this.router.url;
    return (
      url.includes('/login') ||
      url.includes('/register') ||
      url.includes('/forgot-password') ||
      url.includes('/reset-password') ||
      url.includes('/confirm-email') ||
      url.includes('/register-success')
    );
  });

  isLandingRoute = computed(() =>
    this.router.url === '/' || this.router.url === ''
  );

  // ================= METHODS =================
  getDashboardRoute(): string {
    const role = this.userService.currentRole()?.toLowerCase();
    if (role === 'collector') return '/collector-dashboard';
    if (role === 'admin') return '/admin/dashboard';
    return '/citizen-dashboard';
  }

  toggleUserMenu() {
    this.showUserMenu.update(v => !v);
    this.showNotificationsDropdown.set(false);
  }

  toggleNotifications() {
    this.showNotificationsDropdown.update(v => !v);
    this.showUserMenu.set(false);
  }

  closeDropdowns() {
    this.showUserMenu.set(false);
    this.showNotificationsDropdown.set(false);
  }

  switchRole(role: string) {
    this.userService.setCurrentRole(role as any);
    this.closeDropdowns();
    this.router.navigateByUrl(this.getDashboardRoute());
  }

  logout() {
    this.authService.logout();
    this.closeDropdowns();
    this.router.navigateByUrl('/');
  }

  isActiveRoute(route: string): boolean {
    if (route === '/') {
      return this.router.url === '/' || this.router.url === '';
    }
    return this.router.url.startsWith(route);
  }
}
