import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FlashMessageComponent } from './features/flash-message/flash-message/flash-message';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FlashMessageComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('recycling-project');
}
