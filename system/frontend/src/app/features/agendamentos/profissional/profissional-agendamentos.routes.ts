import { Routes } from '@angular/router';

export const ProfissionalAgendamentosRoutes: Routes = [{
    path: '',
    children: [
        {
            path: '',
            pathMatch: 'full',
            redirectTo: ''
        }
    ]
}]