import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

/**
 * Guard to ensure user must select a role before accessing the dashboard
 * Redirects to role-selection if user is logged in but hasn't selected a role yet
 */
export const roleSelectionGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const userService = inject(UserService);
  const router = inject(Router);

  // If not logged in, redirect to login
  if (!auth.isLogged()) {
    router.navigate(['/login']);
    return false;
  }

  // If trying to access role-selection page, allow it
  if (state.url.includes('/role-selection')) {
    return true;
  }

  // If user has already selected a role, allow access
  const userRole = userService.currentRole();
  if (userRole && typeof userRole === 'string' && userRole.length > 0) {
    return true;
  }

  // Otherwise redirect to role-selection (must select a role first)
  router.navigate(['/role-selection']);
  return false;
};
