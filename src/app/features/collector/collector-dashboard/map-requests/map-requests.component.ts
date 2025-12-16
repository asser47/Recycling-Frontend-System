import { Component, computed, inject, output } from '@angular/core';
import { DataService } from '../../../../core/services/data.service';
import { OrderDto } from '@core/models/order.model';
import { MapContainerComponent } from '../../../../shared/components/map-container/map-container.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../../../shared/ui/card/card.component';

@Component({
  selector: 'app-collector-map-requests',
  standalone: true,
  imports: [
    MapContainerComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent
  ],
  templateUrl: './map-requests.component.html',
  styleUrl: './map-requests.component.css'
})
export class CollectorMapRequestsComponent {
  dataService: DataService = inject(DataService);

  allRequests = computed(() => this.dataService.collectionRequests());

  selectRequest = output<OrderDto>();

  onMarkerClick(request: OrderDto): void {
    this.selectRequest.emit(request);
  }
}
