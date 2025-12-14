import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  icon: string;
  label: string;
  path: string;
  badge?: string;
}

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="w-64 bg-card border-r border-border h-screen flex flex-col">
      <!-- Header -->
      <div class="p-6 border-b border-border">
        <h1 class="text-2xl font-bold text-primary">{{ t('adminPanel') }}</h1>
        <p class="text-xs text-muted-foreground mt-1">{{ t('admin') }}</p>
      </div>

      <!-- Navigation Items -->
      <ul class="flex-1 overflow-y-auto p-4 space-y-2">
        <li *ngFor="let item of navItems">
          <a
            [routerLink]="item.path"
            routerLinkActive="bg-primary/20 text-primary border-l-2 border-primary"
            class="flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-muted group"
          >
            <span class="text-xl mr-3">{{ item.icon }}</span>
            <span class="flex-1 text-sm font-medium">{{ item.label }}</span>
            <span *ngIf="item.badge" class="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {{ item.badge }}
            </span>
          </a>
        </li>
      </ul>

      <!-- Footer -->
      <div class="p-4 border-t border-border space-y-2">
        <button
          (click)="logout()"
          class="w-full flex items-center px-4 py-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <span class="text-xl mr-2">🚪</span>
          <span class="text-sm font-medium">{{ t('logout') }}</span>
        </button>
      </div>
    </nav>
  `,
  styles: []
})
export class AdminNavbarComponent {
  languageService = inject(LanguageService);
  authService = inject(AuthService);
  router = inject(Router);

  t = (key: string) => this.languageService.t(key);

  navItems: NavItem[] = [
    { icon: '📊', label: 'Dashboard', path: '/admin/dashboard' },
    { icon: '🎁', label: 'Reward Management', path: '/admin/reward-management' },
    { icon: '👥', label: 'Manage Users', path: '/admin/manage-users' },
    { icon: '📦', label: 'Manage Orders', path: '/admin/manage-orders' },
    { icon: '🔧', label: 'Manage Materials', path: '/admin/manage-materials' },
    { icon: '🏭', label: 'Manage Factories', path: '/admin/manage-factories' }
  ];

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
