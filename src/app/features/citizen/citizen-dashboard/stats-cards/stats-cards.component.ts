import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '../../../../shared/ui/stat-card/stat-card.component';
import { Stat } from '@core/models/users/stat.model';

@Component({
  selector: 'app-citizen-stats-cards',
  standalone: true,
  imports: [CommonModule, StatCardComponent],
  templateUrl: './stats-cards.component.html',
  styleUrl: './stats-cards.component.css'
})
export class CitizenStatsCardsComponent {
  @Input() stats: Stat[] = [];
}
