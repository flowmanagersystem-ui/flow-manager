import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';
import { LayoutComponent } from './core/layout/layout/layout.component';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    loadComponent: () => import('./core/auth/login/login-form.component').then(m => m.LoginFormComponent)
  },

  // ── ADMIN ────────────────────────────────────────────────────
  {
    path: 'admin',
    component: LayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { perfis: ['ADMIN'] },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'agenda'
      },
      // {
      //   path: 'dashboard',
      //   component: DashboardComponent,
      //   data: { breadcrumb: 'Dashboard' }
      // },
      {
        path: 'agenda',
        loadChildren: () => import('./features/agenda/agenda.routes').then(m => m.AgendaRoutes),
        data: { breadcrumb: 'Agenda' }
      },
      {
        path: 'agendamentos',
        loadChildren: () => import('./features/agendamentos/admin/admin-agendamentos.routes').then(m => m.AdminAgendamentosRoutes),
        data: { breadcrumb: 'Agendamentos' }
      },
      {
        path: 'clientes',
        loadChildren: () => import('./features/clientes/cliente.routes').then(m => m.ClientesRoutes),
        data: { breadcrumb: 'Clientes' }
      },
      {
        path: 'profissionais',
        loadChildren: () => import('./features/profissionais/profissional.routes').then(m => m.ProfissionaisRoutes),
        data: { breadcrumb: 'Profissionais' }
      },
      {
        path: 'servicos',
        loadChildren: () => import('./features/servicos/servico.routes').then(m => m.ServicosRoutes),
        data: { breadcrumb: 'Serviços' }
      }
    ]
  },

  // ── PROFISSIONAL ─────────────────────────────────────────────
  {
    path: 'profissional',
    component: LayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { perfis: ['PROFISSIONAL'] },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'agenda'
      },
      {
        path: 'agenda',
        loadChildren: () => import('./features/agenda/agenda.routes').then(m => m.AgendaRoutes),
        data: { breadcrumb: 'Agenda' }
      },
      {
        path: 'agendamentos',
        loadChildren: () => import('./features/agendamentos/profissional/profissional-agendamentos.routes').then(m => m.ProfissionalAgendamentosRoutes),
        data: { breadcrumb: 'Agendamentos' }
      },
      {
        path: 'meu-perfil',
        loadChildren: () => import('./features/profissionais/meu-perfil/meu-perfil.routes').then(m => m.MeuPerfilRoutes),
        data: { breadcrumb: 'Meu Perfil' }
      }
    ]
  },

  // ── CLIENTE ──────────────────────────────────────────────────
  {
    path: 'cliente',
    component: LayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { perfis: ['CLIENTE'] },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'agenda'
      },
      {
        path: 'agenda',
        loadChildren: () => import('./features/agenda/agenda.routes').then(m => m.AgendaRoutes),
        data: { breadcrumb: 'Agenda' }
      },
    ]
  },

  // ── coringa ──────────────────────────────────────────────────
  {
    path: '**',
    redirectTo: 'login'
  }
];