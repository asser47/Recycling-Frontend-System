import { CommonModule } from '@angular/common';
import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-request-item',
  imports: [CommonModule],
  templateUrl: './request-item.html',
  styleUrl: './request-item.css',
})
export class RequestItem {

  @Input() area = '';
  @Input() distance: number | string = '';
  @Input() type = '';
  @Input() weight = '';

  accept() {
    // dummy action: يمكنك استبداله بمناداة HTTP service
    alert(`Accepted pickup at ${this.area} — ${this.weight}`);
  }

}
