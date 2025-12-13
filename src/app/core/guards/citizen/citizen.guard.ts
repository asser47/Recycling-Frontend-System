import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

/**
 * Guard to restrict access to citizen routes
 * Only users with 'Citizen' role can access these routes
 */
export const citizenGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  const role = userService.currentRole();

  if (role === 'citizen') {
    return true;
  }

  // Redirect to role selection to choose correct role
  router.navigate(['/role-selection']);
  return false;
};
