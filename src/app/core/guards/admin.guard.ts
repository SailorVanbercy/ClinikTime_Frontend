import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const adminGuard = () => {
  const router = inject(Router);

  // RÉCUPÉRATION (Adapte selon ton stockage réel)
  const role = localStorage.getItem('role');

  // LOGS DE DEBUG
  console.log('--- DEBUG ADMIN GUARD ---');
  console.log('Role trouvé dans localStorage :', role);

  if (role === 'Admin') {
    return true;
  }

  console.log('Accès refusé : Le rôle n\'est pas Admin');
  router.navigate(['/home']);
  return false;
};
