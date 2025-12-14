import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

/**
 * Guard to restrict access to collector routes
 * Only users with 'Collector' role can access these routes
 */
export const collectorGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  const role = userService.currentRole();

  if (role === 'collector') {
    return true;
  }

  // Redirect to role selection to choose correct role
  router.navigate(['/role-selection']);
  return false;
};
