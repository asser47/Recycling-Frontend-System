import {
  Component,
  inject,
  computed,
  signal,
  ChangeDetectionStrategy,
  OnInit,
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
import { Role } from '@core/models/role.enum';
import { UserMenuDropdownComponent } from '../user-menu-dropdown/user-menu-dropdown.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, RouterLinkActive, UserMenuDropdownComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  // ================= INJECTS =================
  private router = inject(Router);
  private authService = inject(AuthService);
   profileService = inject(UserProfileService);

  themeService = inject(ThemeService);
  languageService = inject(LanguageService);
  userService = inject(UserService);
  notificationService = inject(NotificationService);

  // ================= UI STATE =================
  showUserMenu = signal(false);
  showNotificationsDropdown = signal(false);
  showRoleMenu = signal(false);

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

  // ================= USER DATA =================
displayName = computed(() =>
    this.profileService.userProfile()?.fullName || 'User'
  );

  userEmail = computed(() =>
    this.profileService.userProfile()?.email || ''
  );

  userPoints = computed(() =>
    this.profileService.userProfile()?.points ?? 0
  );

  unreadNotifications = this.notificationService.unreadCount;

  // ================= INIT =================
  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.profileService.loadUserProfile().subscribe();
    }
  }

  // ================= ROUTES =================
  getDashboardRoute(): string {
    if (this.isAdmin()) return '/admin/dashboard';
    if (this.isCollector()) return '/collector-dashboard';
    return '/citizen-dashboard';
  }

  // ================= ACTIONS =================
  toggleUserMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.showUserMenu.set(!this.showUserMenu());
    // this.showNotificationsDropdown.set(false);
  }

  toggleNotifications(event: MouseEvent) {
    event.stopPropagation();
    this.showNotificationsDropdown.update(v => !v);
    this.showUserMenu.set(false);
  }

  toggleRoleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.showRoleMenu.set(!this.showRoleMenu());
    this.showUserMenu.set(false);
  }

  closeDropdowns(): void {
    this.showUserMenu.set(false);
    this.showNotificationsDropdown.set(false);
    this.showRoleMenu.set(false);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeDropdowns();
  }

  goHome(): void {
    this.closeDropdowns();
    this.router.navigateByUrl('/');
  }

  goHomeAndReset() {
    this.authService.logout();
    this.profileService.clearProfile();
    this.closeDropdowns();
    this.router.navigateByUrl('/');
  }

  isActiveRoute(route: string): boolean {
    return this.router.url.startsWith(route);
  }
goToDashboard(): void {
    this.closeDropdowns();
    if (this.role() === Role.Admin) {
      this.router.navigateByUrl('/admin/dashboard');
    } else if (this.role() === Role.Collector) {
      this.router.navigateByUrl('/collector-dashboard');
    } else {
      this.router.navigateByUrl('/citizen-dashboard');
    }
  }

  logout(): void {
    this.authService.logout();
    this.profileService.clearProfile();
    this.closeDropdowns();
    this.router.navigateByUrl('/login');
  }

}
