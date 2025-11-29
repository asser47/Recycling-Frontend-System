import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css'],
  imports: [CommonModule, RouterModule]
})
export class AdminLayoutComponent {
  constructor(private router: Router) {}

  go(path: string) {
  this.router.navigate(['admin', path]);
}

goToLogin() {
  this.router.navigate(['login']);
}

goToAccount() {
  this.router.navigate(['user', 'account']);
}


}
