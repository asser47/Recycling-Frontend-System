import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CollectorDashboard } from './features/collector/collector-dashboard/collector-dashboard';


@Component({
  selector: 'app-root',
  imports: [ RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('recycling-project');
}
