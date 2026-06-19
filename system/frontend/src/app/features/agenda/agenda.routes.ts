import { Routes } from '@angular/router';
import { AgendaPerfilComponent } from './agenda-perfil.component';

export const AgendaRoutes: Routes = [
  {
    path: '',
    component: AgendaPerfilComponent,
    data: { breadcrumb: 'Agenda' }
  }
]
