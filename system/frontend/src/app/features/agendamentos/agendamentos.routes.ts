import { Routes } from '@angular/router';
import { AgendamentosComponent } from './containers/agendamentos/agendamentos.component';
import { AgendamentoFormComponent } from './containers/agendamento-form/agendamento-form.component';

export const AgendamentosRoutes: Routes = [{
    path: '',
    children: [
        {
            path: '',
            pathMatch: 'full',
            redirectTo: ''
        },
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
}]