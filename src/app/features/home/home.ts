import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { FlashMessageService } from '../../core/services/flash-message.service';
import { Role } from '../../core/models/role.enum';
import { LanguageService } from '../../core/services/language.service';
import { HomeFeaturesComponent } from './components/features/features.component';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HomeFeaturesComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  // ==================== INJECTIONS ====================
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly flashMessage = inject(FlashMessageService);
  private readonly languageService = inject(LanguageService);

  // ==================== PUBLIC PROPERTIES ====================
  readonly Role = Role;
  readonly direction = this.languageService.direction;

  // ==================== GETTERS ====================
  get isLogged(): boolean {
    return this.authService.isLogged();
  }

  get role(): Role | null {
    return this.authService.getRole();
  }

  // ==================== TRANSLATIONS ====================
  private readonly translations: Record<string, string> = {
    'heroTitle': 'GreenZone Recycling System',
    'heroSubtitle': 'Smart platform for managing, collecting, and transforming waste into valuable environmental opportunities.',
    'getStarted': 'Get Started',
    'learnMore': 'Learn More'
  };

  t(key: string): string {
    return this.translations[key] ?? this.languageService.t(key) ?? key;
  }

  // ==================== NAVIGATION ====================
  goTo(path: string): void {
    try {
      this.router.navigateByUrl('/' + path).catch(err => {
        console.error('Navigation error:', err);
        this.flashMessage.showError('Navigation failed');
      });
    } catch (error) {
      console.error('Navigate error:', error);
    }
  }

  goProtected(path: string): void {
    if (!this.authService.isLogged()) {
      this.flashMessage.showError('You must login first 🔒');
      this.router.navigateByUrl('/login');
      return;
    }
    this.goTo(path);
  }

  // ==================== SCROLL & UI ====================
  scrollToFeatures(): void {
    try {
      this.router.navigate([], { fragment: 'features' });
      setTimeout(() => {
        const element = document.getElementById('features');
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (error) {
      console.error('Scroll error:', error);
    }
  }

  // ==================== FEATURES DATA ====================
  readonly features: Feature[] = [
    {
      icon: 'Recycle',
      title: 'Easy Collection Requests',
      description: 'Schedule pickups for your recyclable materials with just a few clicks.'
    },
    {
      icon: 'MapPin',
      title: 'Smart Route Planning',
      description: 'Our collectors use optimized routes to reduce emissions.'
    },
    {
      icon: 'Gift',
      title: 'Earn Rewards',
      description: 'Get rewarded for your recycling efforts with points.'
    },
    {
      icon: 'TrendingUp',
      title: 'Track Your Impact',
      description: 'Monitor your environmental contribution with detailed analytics.'
    },
    {
      icon: 'Users',
      title: 'Community Driven',
      description: 'Join thousands of eco-conscious citizens making a difference.'
    },
    {
      icon: 'Leaf',
      title: 'Sustainable Future',
      description: 'Be part of the solution for a greener tomorrow.'
    }
  ];



}






