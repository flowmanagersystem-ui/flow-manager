// Angular
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

// Services
import { AuthService } from './auth.service';

// Interfaces
import { PerfilUsuario } from './auth.interface';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService)
  const router = inject(Router)
  const perfisPermitidos = route.data['perfis'] as PerfilUsuario[]
  const perfil = authService.getPerfil()

  if (perfil && perfisPermitidos.includes(perfil)) {
    return true
  }

  return router.createUrlTree([authService.rotaInicialPorPerfil(perfil)])
}
