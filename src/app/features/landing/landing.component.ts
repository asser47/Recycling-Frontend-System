import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { AuthService } from '../../core/services/auth.service';
import { LandingFeaturesComponent } from './components/features/features.component';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, LandingFeaturesComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  languageService = inject(LanguageService);
  authService = inject(AuthService);
  router = inject(Router);

  direction = this.languageService.direction;
  isLogged = this.authService.isLogged;
  t = (key: string) => this.languageService.t(key);

  scrollToFeatures() {
    this.router.navigate([], { fragment: 'features' });
    setTimeout(() => {
      const element = document.getElementById('features');
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  features: Feature[] = [
    { icon: 'Recycle', title: 'Easy Collection Requests', description: 'Schedule pickups for your recyclable materials with just a few clicks.' },
    { icon: 'MapPin', title: 'Smart Route Planning', description: 'Our collectors use optimized routes to reduce emissions.' },
    { icon: 'Gift', title: 'Earn Rewards', description: 'Get rewarded for your recycling efforts with points.' },
    { icon: 'TrendingUp', title: 'Track Your Impact', description: 'Monitor your environmental contribution with detailed analytics.' },
    { icon: 'Users', title: 'Community Driven', description: 'Join thousands of eco-conscious citizens making a difference.' },
    { icon: 'Leaf', title: 'Sustainable Future', description: 'Be part of the solution for a greener tomorrow.' }
  ];
}

