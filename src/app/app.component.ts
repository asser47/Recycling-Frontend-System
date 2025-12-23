import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FlashMessageComponent } from './features/flash-message/flash-message/flash-message';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FlashMessageComponent],
    templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'GreenZone';

  
  private router = inject(Router);

  isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }
}


