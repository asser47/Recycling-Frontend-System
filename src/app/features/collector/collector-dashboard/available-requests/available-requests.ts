import { Component, computed, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../../core/services/data.service';
import { CollectionRequest } from '../../../../core/models/collection-request.model';
import { RequestCardComponent } from '../../../../shared/ui/request-card/request-card.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../../../shared/ui/card/card.component';

@Component({
  selector: 'app-collector-available-requests',
  imports: [
    CommonModule,
    RequestCardComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent
  ],
  templateUrl: './available-requests.html',
  styleUrl: './available-requests.css',
})
export class CollectorAvailableRequestsComponent {
  dataService = inject(DataService);
  collectorId = 1;

  pendingRequests = computed(() =>
    this.dataService.pendingRequests().filter(r => !r.collectorId || r.collectorId !== this.collectorId)
  );

  selectRequest = output<CollectionRequest>();
  acceptRequest = output<CollectionRequest>();

  onCardClick(request: CollectionRequest): void {
    this.selectRequest.emit(request);
  }

  onAccept(request: CollectionRequest): void {
    this.acceptRequest.emit(request);
  }
}
