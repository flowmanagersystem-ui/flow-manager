import { Routes } from '@angular/router';

export const ProfissionalAgendamentosRoutes: Routes = [{
    path: '',
    loadComponent: () => import('./containers/profissional-agendamentos/profissional-agendamentos.component')
        .then(m => m.ProfissionalAgendamentosComponent)
}]
