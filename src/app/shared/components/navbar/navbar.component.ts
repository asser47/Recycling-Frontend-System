import {
  Component,
  inject,
  computed,
  signal,
  ChangeDetectionStrategy,
  HostListener   
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserProfileService } from '@core/services/user-profile.service';
import { ThemeService } from '../../../core/services/theme.service';
import { LanguageService } from '../../../core/services/language.service';
import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { DataService } from '../../../core/services/data.service';
import { UserDataService } from '../../../core/services/user-data.service';
import { Role } from '@core/models/role.enum';

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
  private router = inject(Router);
  private authService = inject(AuthService);
  private profileService = inject(UserProfileService);

  themeService = inject(ThemeService);
  languageService = inject(LanguageService);
  userService = inject(UserService);
  notificationService = inject(NotificationService);
  dataService = inject(DataService);
  userDataService = inject(UserDataService);

  // ================= UI STATE =================
  showUserMenu = signal(false);
  showNotificationsDropdown = signal(false);

  // ================= AUTH =================
  isLoggedIn = this.authService.isLoggedIn;
  role = this.authService.roleSignal;

  isAdmin = computed(() => this.role() === Role.Admin);
  isCollector = computed(() => this.role() === Role.Collector);
  isUser = computed(() => this.role() === Role.User);

  roleLabel = computed(() => {
    if (this.isAdmin()) return 'Admin';
    if (this.isCollector()) return 'Collector';
    return 'User';
  });

  // ================= DATA =================
  userPoints = computed(() =>
    this.dataService.currentUser()?.points ?? 0
  );

  unreadNotifications = this.notificationService.unreadCount;
  userData = this.userDataService.userData;

displayName = computed(() => {
  const profile = this.profileService.userProfile();

  if (!profile) return '';

  // لو API بيرجع fullName
  if (profile.fullName) return profile.fullName;

  // لو بيرجع first + last
  return `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim();
});


  // ================= ROUTES =================
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

  getDashboardRoute(): string {
    if (this.isAdmin()) return '/admin/dashboard';
    if (this.isCollector()) return '/collector-dashboard';
    return '/citizen-dashboard';
  }

  // ================= ACTIONS =================
toggleUserMenu(event?: MouseEvent) {
  event?.stopPropagation();          // ✅ مهم
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

  switchRole(role: any) {
    this.userService.setCurrentRole(role);
    this.closeDropdowns();
    this.router.navigateByUrl(this.getDashboardRoute());
  }

  logout() {
    this.authService.logout();
    this.profileService.clearProfile(); // ✅ مهم
    this.closeDropdowns();
    this.router.navigateByUrl('/login');
  }
@HostListener('document:click')
closeOnOutsideClick() {
  this.showUserMenu.set(false);
  this.showNotificationsDropdown.set(false);
}

  // ================= ⭐ المطلوب =================
  // الضغط على اسم المشروع / اللوجو
  // يرجّع Navbar لحالة Guest
  goHomeAndReset() {
    this.authService.logout();     // يمسح token + role
    this.closeDropdowns();
    this.router.navigateByUrl('/'); // Home كـ Guest
  }

  isActiveRoute(route: string): boolean {
    if (route === '/') {
      return this.router.url === '/' || this.router.url === '';
    }
    return this.router.url.startsWith(route);
  }
}
