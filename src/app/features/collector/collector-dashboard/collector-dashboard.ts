import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { StatCard } from './stat-card/stat-card';
import { LiveMap } from './live-map/live-map';
import { RequestItem } from './request-item/request-item';

@Component({
  selector: 'app-collector-dashboard',
  imports: [CommonModule, StatCard, LiveMap, RequestItem],
  templateUrl: './collector-dashboard.html',
  styleUrl: './collector-dashboard.css',
})
export class CollectorDashboard {

    // Signals for reactive UI
  stats = signal([
    { value: 24, label: 'Total Pickups' },
    { value: '4.8 ⭐', label: 'Rating' },
    { value: 3, label: 'Active Now' }
  ]);

  // requests signal - includes lat/lng for the map markers
  requests = signal([
    { area: 'Nasr City', distance: 2.3, type: 'Plastic, Cans', weight: 'Est. 5kg', lat: 30.0561, lng: 31.3139 },
    { area: 'Heliopolis', distance: 4.1, type: 'Paper', weight: 'Est. 8kg', lat: 30.0687, lng: 31.2795 },
    { area: 'Zamalek', distance: 6.0, type: 'Glass', weight: 'Est. 3kg', lat: 30.0646, lng: 31.2195 }
  ]);

}
