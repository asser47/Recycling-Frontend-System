import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.services/auth.service';
import { Role } from '../../models/users/role.enum';

export const userGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // لو مش عامل login → مسموح
  if (!auth.isLogged()) {
    return true;
  }

  // لو عامل login بس مش User → ممنوع
  const role = auth.getRole();
  if (role !== Role.User) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
