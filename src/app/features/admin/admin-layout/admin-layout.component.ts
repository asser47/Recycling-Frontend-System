import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterOutlet, AdminNavbarComponent],
  template: `
    <div class="flex h-screen bg-background">
      <!-- Sidebar Navigation -->
      <app-admin-navbar></app-admin-navbar>

      <!-- Main Content -->
      <main class="flex-1 overflow-auto">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: []
})
export class AdminLayoutComponent {
  languageService = inject(LanguageService);
  router = inject(Router);

  t = (key: string) => this.languageService.t(key);
}
