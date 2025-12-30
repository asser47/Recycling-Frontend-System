import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.services/auth.service';
import { inject } from '@angular/core';
import { Role } from '../../models/users/role.enum';

export const collectorGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLogged()) {
    router.navigate(['/login']);
    return false;
  }

  if (auth.getRole() !== Role.Collector) {
    router.navigate(['/']);
    return false;
  }

  return true;
};

