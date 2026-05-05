import { Routes } from '@angular/router';
import { ProfissionaisComponent } from './containers/profissionais/profissionais.component';
import { ProfissionaisListComponent } from './components/profissionais-list/profissionais-list.component';

export const ProfissinalRoutes: Routes = [{
    path: '',
    children: [
        {
            path: '',
            pathMatch: 'full',
            redirectTo: ''
        },
        {
            path: '',
            component: ProfissionaisComponent,
            data: { breadcrumb: 'Lista de Profissionais' }
        },
        // {
        //     path: 'novo',
        //     component: ClienteFormComponent,
        //     data: { breadcrumb: 'Novo Cliente' }
        // }

    ]
}]