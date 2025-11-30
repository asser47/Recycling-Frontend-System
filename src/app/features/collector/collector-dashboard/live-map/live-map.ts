import { CommonModule } from '@angular/common';
import { Component, Input, AfterViewInit, OnDestroy, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-live-map',
  imports: [CommonModule],
  templateUrl: './live-map.html',
  styleUrl: './live-map.css',
})
export class LiveMap implements AfterViewInit, OnDestroy, OnChanges {

    @ViewChild('mapEl', { static: true }) mapEl!: ElementRef<HTMLDivElement>;
  @Input() markers: Array<{lat:number, lng:number, area?:string, type?:string}> = [];

  private map?: L.Map;
  private markersLayer?: L.LayerGroup;

  ngAfterViewInit(): void {
    // Fix default icon paths (use CDN images)
    (L.Icon.Default as any).mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
    });

    this.map = L.map(this.mapEl.nativeElement, {
      center: [30.0626, 31.2497], // Cairo center as default
      zoom: 12,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.markersLayer = L.layerGroup().addTo(this.map);
    this.updateMarkers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map && changes['markers']) {
      this.updateMarkers();
    }
  }

  private updateMarkers() {
    if (!this.markersLayer) return;
    this.markersLayer.clearLayers();

    if (!this.markers || this.markers.length === 0) return;

    const leafletMarkers: L.Marker[] = [];
    this.markers.forEach(m => {
      if (typeof m.lat === 'number' && typeof m.lng === 'number') {
        const marker = L.marker([m.lat, m.lng]);
        const popup = `<strong>${m.area ?? 'Request'}</strong><br/>${m.type ?? ''}`;
        marker.bindPopup(popup);
        marker.addTo(this.markersLayer!);
        leafletMarkers.push(marker);
      }
    });

    // Fit map to markers
    const group = L.featureGroup(leafletMarkers);
    if (leafletMarkers.length > 0) {
      this.map!.fitBounds(group.getBounds().pad(0.4));
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }


}
