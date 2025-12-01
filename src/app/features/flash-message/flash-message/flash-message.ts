import { Component } from '@angular/core';
import { FlashMessageService } from '../../../core/services/flash-message.service';
@Component({
  selector: 'app-flash-message',
  imports: [],
  templateUrl: './flash-message.html',
  styleUrl: './flash-message.css',
})
export class FlashMessageComponent {
  constructor(public flash: FlashMessageService) {}
}
