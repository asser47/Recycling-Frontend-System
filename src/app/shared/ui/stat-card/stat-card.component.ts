import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, CardContentComponent } from '../card/card.component';
import { Stat } from '../../../core/models/users/stat.model';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CardComponent, CardContentComponent],
  template: `
    <app-card [className]="'stat-card-modern ' + (className || '')">
      <app-card-content class="stat-card-content">
        <div class="stat-card-inner">
          <div class="stat-card-info">
            <p class="stat-label">{{ stat.label }}</p>
            <p [class]="'stat-value ' + stat.color">{{ stat.value }}</p>
            @if (stat.change) {
              <p class="stat-change">{{ stat.change }}</p>
            }
          </div>
          <div class="stat-icon-wrapper">
            <div class="stat-icon-bg"></div>
            <span class="stat-icon">{{ stat.icon }}</span>
          </div>
        </div>
      </app-card-content>
    </app-card>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .stat-card-modern {
      height: 100%;
      background: hsl(var(--card));
      border: 1px solid hsl(var(--border));
      border-radius: var(--radius-lg);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
      position: relative;
    }

    .stat-card-modern::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, hsla(var(--primary), 0.05) 0%, transparent 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .stat-card-modern:hover {
      transform: translateY(-4px);
      border-color: hsl(var(--primary));
      box-shadow: 0 8px 24px hsla(var(--primary), 0.15);
    }

    .stat-card-modern:hover::before {
      opacity: 1;
    }

    .stat-card-content {
      padding: 1.5rem !important;
      height: 100%;
    }

    .stat-card-inner {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      height: 100%;
    }

    .stat-card-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .stat-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: hsl(var(--muted-foreground));
      margin: 0;
      line-height: 1;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 800;
      margin: 0;
      line-height: 1;
      background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stat-change {
      font-size: 0.75rem;
      color: hsl(var(--muted-foreground));
      margin: 0;
      line-height: 1;
    }

    .stat-icon-wrapper {
      position: relative;
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-icon-bg {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%);
      border-radius: 50%;
      opacity: 0.1;
      transition: all 0.3s ease;
    }

    .stat-card-modern:hover .stat-icon-bg {
      opacity: 0.2;
      transform: scale(1.1);
    }

    .stat-icon {
      position: relative;
      font-size: 2rem;
      z-index: 1;
      transition: transform 0.3s ease;
    }

    .stat-card-modern:hover .stat-icon {
      transform: scale(1.1) rotate(5deg);
    }
  `]
})
export class StatCardComponent {
  @Input({ required: true }) stat!: Stat;
  @Input() className?: string;
}


