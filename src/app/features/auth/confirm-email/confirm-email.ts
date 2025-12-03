import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FlashMessageService } from '../../../core/services/flash-message.service';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  templateUrl: './confirm-email.html',
  styleUrls: ['./confirm-email.css']
})
export class ConfirmEmailComponent {

  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private flash = inject(FlashMessageService);
  private router = inject(Router);

  status: 'loading' | 'success' | 'error' = 'loading';

  ngOnInit() {
    const email = this.route.snapshot.queryParamMap.get('email');
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!email || !token) {
      this.status = 'error';
      return;
    }

    this.auth.confirmEmail(email, token).subscribe({
      next: () => {
        this.status = 'success';
        this.flash.showSuccess("Email confirmed ✔");
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: () => {
        this.status = 'error';
      }
    });
  }
}
