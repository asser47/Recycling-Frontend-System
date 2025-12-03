import { Component } from '@angular/core';
import { RequestItem } from '../request-item/request-item';

@Component({
  selector: 'app-requests-list',
  imports: [RequestItem],
  templateUrl: './requests-list-component.html',
  styleUrl: './requests-list-component.css',
})
export class RequestsListComponent {

  requests = [
    { name: 'John Smith', address: '123 Oak Street', type: 'Plastic', weight: 5, distance: 1.2 },
    { name: 'Emma Wilson', address: '456 Pine Avenue', type: 'Paper', weight: 8, distance: 2.5 },
    { name: 'Michael Brown', address: '789 Maple Drive', type: 'Glass', weight: 3, distance: 0.8 },
    { name: 'Sarah Davis', address: '321 Elm Road', type: 'Metal', weight: 4, distance: 3.1 },
  ];

}
