import { Routes } from '@angular/router';
import { AgendamentoFormComponent } from './containers/agendamento-form/agendamento-form.component';
import { AgendamentosComponent } from './containers/agendamentos/agendamentos.component';

export const AdminAgendamentosRoutes: Routes = [
  {
    path: '',
    component: AgendamentosComponent,
    data: { breadcrumb: 'Lista de Agendamentos' }
  },
  {
    path: 'novo',
    component: AgendamentoFormComponent,
    data: { breadcrumb: 'Novo Agendamento' }
  }
]