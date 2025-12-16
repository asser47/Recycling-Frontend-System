import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../../core/services/language.service';
import { OrderDto } from '@core/models/order.model';
import { CreateCollectionModalComponent } from '../../../../shared/components/create-collection-modal/create-collection-modal.component';

@Component({
  selector: 'app-citizen-collection-request',
  standalone: true,
  imports: [CommonModule, CreateCollectionModalComponent],
  templateUrl: './collection-request.component.html',
  styleUrl: './collection-request.component.css'
})
export class CitizenCollectionRequestComponent {
  @Input() modalOpen = false;
  @Output() modalOpenChange = new EventEmitter<boolean>();
  @Output() requestCreated = new EventEmitter<OrderDto>();

  languageService: LanguageService = inject(LanguageService);

  t = (key: string) => this.languageService.t(key);

  onOpenChange(open: boolean): void {
    this.modalOpenChange.emit(open);
  }

  onRequestCreated(request: OrderDto): void {
    this.requestCreated.emit(request);
  }
}
