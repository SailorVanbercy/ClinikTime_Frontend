import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs';

export const medecinGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1), // 🔥 on prend la valeur courante et on stop
    map(user => {
      if (user?.role === 'Medecin') {
        return true;
      }

      return router.createUrlTree(['/home']);
    })
  );
};
