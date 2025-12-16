import { Component, computed, inject, output } from '@angular/core';
import { DataService } from '../../../../core/services/data.service';
import { OrderDto } from '@core/models/order.model';
import { RequestCardComponent } from '../../../../shared/ui/request-card/request-card.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../../../shared/ui/card/card.component';

@Component({
  selector: 'app-collector-available-requests',
  standalone: true,
  imports: [
    RequestCardComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent
  ],
  templateUrl: './available-requests.component.html',
  styleUrl: './available-requests.component.css'
})
export class CollectorAvailableRequestsComponent {
  dataService: DataService = inject(DataService);
  collectorId = 1;

  pendingRequests = computed(() =>
    this.dataService.pendingRequests().filter((r: any) => !r.collectorId || r.collectorId !== this.collectorId)
  );

  selectRequest = output<OrderDto>();
  acceptRequest = output<OrderDto>();

  onCardClick(request: OrderDto): void {
    this.selectRequest.emit(request);
  }

  onAccept(request: OrderDto): void {
    this.acceptRequest.emit(request);
  }
}
