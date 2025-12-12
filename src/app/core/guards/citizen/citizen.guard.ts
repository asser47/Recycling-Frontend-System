import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * Guard to restrict access to citizen routes
 * Only users with 'Citizen' role can access these routes
 */
export const citizenGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const role = auth.getRole()?.toLowerCase();

  if (role === 'citizen') {
    return true;
  }

  router.navigate(['/']);
  return false;
};
