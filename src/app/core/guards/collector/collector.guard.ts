import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * Guard to restrict access to collector routes
 * Only users with 'Collector' role can access these routes
 */
export const collectorGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const role = auth.getRole()?.toLowerCase();

  if (role === 'collector') {
    return true;
  }

  router.navigate(['/']);
  return false;
};
