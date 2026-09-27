import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // 🔐 Verificamos si existe el token guardado tras el login exitoso
  const token = localStorage.getItem('token');

  if (token && token.trim() !== '') {
    return true; // Permitimos el paso libre a las vistas del panel de control
  }

  console.warn('Acceso denegado. Redirigiendo al inicio de sesión administrativo...');
  
  // 🚪 Si no hay token, lo mandamos directo al login administrativo correspondiente a tus rutas
  router.navigate(['/admin/login']);
  return false;
};