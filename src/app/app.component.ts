import { Component } from '@angular/core';
import {  RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FlashMessageComponent } from './features/flash-message/flash-message/flash-message';
import { HomeFooterComponent } from "@features/home/footer/footer";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FlashMessageComponent, HomeFooterComponent],
    templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'GreenZone';
}


