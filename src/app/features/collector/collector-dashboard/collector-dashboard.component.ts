import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';
import { DataService } from '../../../core/services/user.services/data.service';
import { OrderDto } from '@core/models/orders/order.model';
import { CollectorHeaderComponent } from './header/header.component';
import { CollectorRequestsComponent } from "./my-requests/my-requests.component";
import { CollectorRecentCollectionsComponent } from './recent-collections/recent-collections.component';

@Component({
  selector: 'app-collector-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CollectorHeaderComponent,
    CollectorRequestsComponent,
    CollectorRecentCollectionsComponent
],
  templateUrl: './collector-dashboard.component.html',
  styleUrl: './collector-dashboard.component.css'
})
export class CollectorDashboardComponent {
  languageService: LanguageService = inject(LanguageService);
  dataService: DataService = inject(DataService);

  t = (key: string) => this.languageService.t(key);

  selectedRequest = signal<OrderDto | null>(null);
  collectorId = 1; // Current collector ID

  selectRequest(request: OrderDto): void {
    this.selectedRequest.set(request);
    // Map will handle centering automatically via marker click
  }

  acceptRequest(request: OrderDto): void {
    // Get current active route requests
    const activeRoute = this.dataService.getRequestsByCollectorId(this.collectorId)
      .filter(r => r.status === 'in-progress');

    // Calculate route order (next in sequence)
    const routeOrder = activeRoute.length + 1;

    // Calculate estimated arrival time
    const now = new Date();
    const minutesToAdd = routeOrder * 30;
    const estimatedArrival = new Date(now.getTime() + minutesToAdd * 60 * 1000);

    // Accept request and add to route
    this.dataService.acceptRequestForRoute(
      request.id,
      this.collectorId,
      estimatedArrival.toISOString(),
      routeOrder
    );

    console.log(`Accepted request: ${request.typeOfMaterial} from ${request.userName}`);
    console.log(`Route order: ${routeOrder}`);
  }
}
