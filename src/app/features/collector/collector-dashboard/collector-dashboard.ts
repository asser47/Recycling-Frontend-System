import { Component } from '@angular/core';
import { LiveMap } from './live-map/live-map';
import { StatCard } from './stat-card/stat-card';
import { RequestsListComponent } from './requests-list-component/requests-list-component';

@Component({
  selector: 'app-collector-dashboard',
  imports: [LiveMap, StatCard, RequestsListComponent],
  templateUrl: './collector-dashboard.html',
  styleUrl: './collector-dashboard.css',
})

export class CollectorDashboard {

  stats = [
    { title: 'Collections Today', value: 12, sub: '4 pending', icon: 'recycling' },
    { title: 'Total Weight', value: '245 kg', sub: '+45 kg today', icon: 'trending_up' },
    { title: 'Active Citizens', value: 38, sub: '+5 this week', icon: 'groups' }
  ];
}
