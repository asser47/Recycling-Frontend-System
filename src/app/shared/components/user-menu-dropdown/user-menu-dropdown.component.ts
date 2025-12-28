import { Component, inject, signal, HostListener, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { UserProfileService } from '../../../core/services/user-profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '@core/models/role.enum';

@Component({
  selector: 'app-user-menu-dropdown',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="user-menu-wrapper">
      <!-- Trigger Button -->
      <button
        type="button"
        (click)="isOpen.set(!isOpen()); $event.stopPropagation()"
        class="user-menu-trigger"
        [attr.aria-expanded]="isOpen()"
        aria-label="User menu"
      >
        <div class="user-info">
          <span class="user-name">{{ displayName() }}</span>
          <span class="user-role">{{ roleLabel() }}</span>
        </div>
        <span class="dropdown-arrow" [class.open]="isOpen()">▼</span>
      </button>

      <!-- Dropdown Menu -->
      @if (isOpen()) {
        <div
          class="user-dropdown-menu"
          (click)="$event.stopPropagation()"
          role="menu"
        >
          <!-- User Info Section -->
          <div class="menu-section">
            <div class="user-header">
              <div class="user-avatar">{{ getInitials() }}</div>
              <div class="user-details">
                <div class="user-name-full">{{ displayName() }}</div>
                <div class="user-role-badge">{{ roleLabel() }}</div>
              </div>
            </div>
          </div>

          <div class="menu-divider"></div>

          <!-- Role-Based Actions -->
          <div class="menu-section">
            <!-- View Profile -->
            <a
              routerLink="/profile"
              (click)="closeMenu()"
              class="menu-item"
              role="menuitem"
            >
              <span class="icon">👤</span>
              <span class="item-label">View Profile</span>
            </a>
          </div>

          <div class="menu-divider"></div>

          <!-- Logout -->
          <div class="menu-section">
            <button
              type="button"
              (click)="handleLogout(); closeMenu()"
              class="menu-item logout-item"
              role="menuitem"
            >
              <span class="icon">🚪</span>
              <span class="item-label">Logout</span>
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .user-menu-wrapper {
      position: relative;
      display: inline-block;
    }

    .user-menu-trigger {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0.75rem;
      background: transparent;
      border: 1px solid rgba(22, 163, 74, 0.2);
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.25s ease;
      font-size: 0.9rem;
    }

    .user-menu-trigger:hover {
      background: rgba(22, 163, 74, 0.08);
      border-color: rgba(22, 163, 74, 0.4);
    }

    .user-info {
      display: flex;
      flex-direction: column;
      text-align: left;
    }

    .user-name {
      font-weight: 600;
      font-size: 0.85rem;
      line-height: 1.2;
    }

    .user-role {
      font-size: 0.7rem;
      color: var(--text-muted);
      line-height: 1.2;
    }

    .dropdown-arrow {
      font-size: 0.6rem;
      color: var(--text-muted);
      transition: transform 0.25s ease;
    }

    .dropdown-arrow.open {
      transform: rotate(180deg);
    }

    .user-dropdown-menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      min-width: 280px;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.18);
      z-index: 1000;
      overflow: hidden;
      animation: slideDown 0.2s ease;
    }

    .dark .user-dropdown-menu {
      background: #1f2937;
      border-color: #374151;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .menu-section {
      padding: 0.5rem 0;
    }

    .menu-label {
      padding: 0.5rem 0.75rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .user-header {
      display: flex;
      gap: 0.75rem;
      padding: 0.75rem;
      align-items: flex-start;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #16a34a, #22c55e);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.9rem;
      flex-shrink: 0;
    }

    .user-details {
      flex: 1;
      min-width: 0;
    }

    .user-name-full {
      font-weight: 600;
      font-size: 0.9rem;
      line-height: 1.3;
    }

    .user-email {
      font-size: 0.8rem;
      color: var(--text-muted);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1.3;
    }

    .user-role-badge {
      display: inline-block;
      margin-top: 0.25rem;
      padding: 0.25rem 0.5rem;
      background: rgba(22, 163, 74, 0.12);
      color: #16a34a;
      border-radius: 0.25rem;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .menu-divider {
      height: 1px;
      background: var(--glass-border);
      margin: 0.25rem 0;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.6rem 0.75rem;
      background: transparent;
      border: none;
      cursor: pointer;
      text-align: left;
      font-size: 0.85rem;
      color: inherit;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .menu-item:hover {
      background: rgba(22, 163, 74, 0.12);
    }

    .menu-item.logout-item {
      color: var(--danger);
      font-weight: 600;
    }

    .menu-item.logout-item:hover {
      background: rgba(220, 38, 38, 0.12);
    }

    .menu-item.role-item {
      position: relative;
    }

    .menu-item.role-item.active {
      background: rgba(22, 163, 74, 0.12);
      font-weight: 600;
    }

    .checkmark {
      margin-left: auto;
      color: #16a34a;
      font-weight: 700;
    }

    .icon {
      font-size: 1.1rem;
      flex-shrink: 0;
      display: inline-block;
      width: 1.2rem;
      text-align: center;
    }

    .item-label {
      flex: 1;
      font-weight: 500;
    }

    .item-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .info-item {
      cursor: default;
    }

    .info-item:hover {
      background: transparent;
    }

    .item-value {
      font-weight: 700;
      color: #16a34a;
      font-size: 0.9rem;
    }
  `]
})
export class UserMenuDropdownComponent {
  authService = inject(AuthService);
  userService = inject(UserService);
  profileService = inject(UserProfileService);
  router = inject(Router);

  isOpen = signal(false);

  // ========== Computed Properties ==========
  currentRole = computed(() => this.authService.roleSignal());

  isAdmin = computed(() => this.currentRole() === Role.Admin);
  isCollector = computed(() => this.currentRole() === Role.Collector);
  isUser = computed(() => this.currentRole() === Role.User);

  displayName = computed(() =>
    this.profileService.userProfile()?.fullName || 'User'
  );

  userEmail = computed(() =>
    this.profileService.userProfile()?.email || ''
  );

  userPoints = computed(() =>
    this.profileService.userProfile()?.points ?? 0
  );

  // Available roles (can be 1-3 roles based on user)
  availableRoles = computed(() => {
    const roles: Role[] = [];
    // Always include current role
    const current = this.currentRole();
    if (current) {
      roles.push(current);
    }
    // Add other roles if applicable (Admin can access all)
    if (this.isAdmin()) {
      if (!roles.includes(Role.Collector)) roles.push(Role.Collector);
      if (!roles.includes(Role.User)) roles.push(Role.User);
    }
    if (this.isCollector() && !roles.includes(Role.User)) {
      roles.push(Role.User);
    }
    return roles;
  });

  roleLabel = computed(() => {
    if (this.isAdmin()) return 'Admin';
    if (this.isCollector()) return 'Collector';
    return 'User';
  });

  // ========== Methods ==========
  getInitials(): string {
    const name = this.displayName();
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getRoleLabel(role: Role): string {
    switch (role) {
      case Role.Admin:
        return 'Admin';
      case Role.Collector:
        return 'Collector';
      default:
        return 'User';
    }
  }

  getRoleIcon(role: Role): string {
    switch (role) {
      case Role.Admin:
        return '👨‍💼';
      case Role.Collector:
        return '🚚';
      default:
        return '👤';
    }
  }

  isCurrentRole(role: Role): boolean {
    return this.currentRole() === role;
  }

  switchRole(role: Role): void {
    // If user doesn't have the role yet, show a message
    if (role === Role.Admin && !this.isAdmin()) {
      alert('You do not have admin privileges');
      return;
    }
    if (role === Role.Collector && !this.isCollector() && !this.isAdmin()) {
      alert('You do not have collector role');
      return;
    }

    // Navigate to appropriate dashboard for the role
    this.goToDashboard();
  }

  goToDashboard(): void {
    const role = this.currentRole();
    if (role === Role.Admin) {
      this.router.navigateByUrl('/admin/dashboard');
    } else if (role === Role.Collector) {
      this.router.navigateByUrl('/collector-dashboard');
    } else {
      this.router.navigateByUrl('/citizen-dashboard');
    }
  }

  closeMenu(): void {
    this.isOpen.set(false);
  }

  handleLogout(): void {
    this.authService.logout();
    this.profileService.clearProfile();
    this.closeMenu();
    this.router.navigateByUrl('/login');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('app-user-menu-dropdown')) {
      this.isOpen.set(false);
    }
  }
}
