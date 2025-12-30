import { Component, inject, signal, DestroyRef } from '@angular/core';
import { DataService } from '../../../../core/services/user.services/data.service';
import { CollectorService } from '../../../../core/services/collector.sevices/collector.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RequestCardComponent } from '../../../../shared/ui/request-card/request-card.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../../../shared/ui/card/card.component';

@Component({
  selector: 'app-collector-recent-collections',
  standalone: true,
  imports: [
    RequestCardComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent
  ],
  templateUrl: './recent-collections.component.html',
  styleUrl: './recent-collections.component.css'
})
export class CollectorRecentCollectionsComponent {
  dataService: DataService = inject(DataService);
  collectorService = inject(CollectorService);
  destroyRef = inject(DestroyRef);

  collectorId = 1;
  recentCollections = signal<any[]>([]);

  ngOnInit(): void {
    this.loadRecentCollections();
  }

  /**
   * Load recent completed orders from API
   */
  private loadRecentCollections(): void {
    this.collectorService
      .getMyOrders()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (orders) => {
          if (!orders) {
            this.recentCollections.set([]);
            return;
          }

          // Get completed orders, sorted by date (newest first), limit to 5
          const completed = orders
            .filter((o: any) => o.status?.toLowerCase() === 'completed')
            .sort((a: any, b: any) => {
              const dateA = new Date(a.orderDate).getTime();
              const dateB = new Date(b.orderDate).getTime();
              return dateB - dateA; // Newest first
            })
            .slice(0, 5);

          this.recentCollections.set(completed);
        },
        error: (err) => {
          console.error('Failed to load recent collections:', err);
          this.recentCollections.set([]);
        },
      });
  }
}
