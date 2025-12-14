import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FlashMessagesComponent } from './shared/components/flash-messages/flash-messages.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FlashMessagesComponent],
    templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'GreenZone';
}

