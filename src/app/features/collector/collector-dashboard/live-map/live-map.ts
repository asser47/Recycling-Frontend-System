import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-live-map',
  imports: [],
  templateUrl: './live-map.html',
  styleUrl: './live-map.css',
})
export class LiveMap implements AfterViewInit {

private map!: L.Map;

  markers = [
    { lat: 30.0444, lng: 31.2357, label: 'Pending Request #1' },
    { lat: 30.0500, lng: 31.2400, label: 'Pending Request #2' },
    { lat: 30.0600, lng: 31.2450, label: 'Pending Request #3' },
  ];

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('collectorMap', {
      center: [30.0444, 31.2357],
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20
    }).addTo(this.map);

    // add markers
    this.markers.forEach(point => {
      L.marker([point.lat, point.lng])
        .addTo(this.map)
        .bindPopup(point.label);
    });
  }
}
