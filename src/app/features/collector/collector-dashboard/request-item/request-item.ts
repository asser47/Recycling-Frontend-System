import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-request-item',
  imports: [],
  templateUrl: './request-item.html',
  styleUrl: './request-item.css',
})
export class RequestItem {

@Input() request!: {
    name: string;
    address: string;
    type: string;
    weight: number;
    distance: number;
  };

  onAccept() {
    console.log('Accepted:', this.request.name);
  }

  onRoute() {
    console.log('View Route:', this.request.name);
  }
}
