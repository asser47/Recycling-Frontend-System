import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.services/auth.service';
// import { FlashMessageService } from '../../core/services/flash-message.service';
import { Role } from '../../core/models/users/role.enum';
import { LanguageService } from '../../core/services/language.service';
import { HomeFeaturesComponent } from './features/features.component';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HomeFeaturesComponent,
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

  private auth = inject(AuthService);
  private lang = inject(LanguageService);

  readonly Role = Role;
  readonly direction = this.lang.direction;

  get isLogged(): boolean {
    return this.auth.isLogged();
  }

  t(key: string): string {
    const map: Record<string, string> = {
      heroTitle: 'GreenZone Recycling System',
      heroSubtitle: 'Transform waste into real environmental impact with smart recycling solutions.',
      getStarted: 'Get Started',
      learnMore: 'Learn More'
    };
    return map[key] ?? key;
  }

  scrollToFeatures(): void {
    document.getElementById('features')
      ?.scrollIntoView({ behavior: 'smooth' });
  }

  readonly features: Feature[] = [
    { icon: 'Recycle', title: 'Easy Collection', description: 'Schedule pickups in seconds.' },
    { icon: 'MapPin', title: 'Smart Routes', description: 'Optimized paths reduce emissions.' },
    { icon: 'Gift', title: 'Earn Rewards', description: 'Recycle and earn points.' },
    { icon: 'TrendingUp', title: 'Track Impact', description: 'Visualize your eco impact.' },
    { icon: 'Users', title: 'Community', description: 'Join eco-conscious users.' },
    { icon: 'Leaf', title: 'Sustainability', description: 'Build a greener future.' }
  ];
}
