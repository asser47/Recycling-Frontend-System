import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.services/auth.service';

export const authPagesGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // لو مسجّل دخول بالفعل
  if (auth.isLogged()) {
    router.navigate(['/']); // أو dashboard
    return false;
  }

  return true;
};
