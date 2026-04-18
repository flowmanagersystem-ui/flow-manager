import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: ''
  },
  {
    path: '',
    loadChildren: () => import('./core/layout/layout.routes').then(m => m.LayoutRoutes),
  },
  {
    path: 'auth',
    loadChildren: () => import('./core/auth/auth.routes').then(m => m.AuthRoutes)
  },
];