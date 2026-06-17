import { Routes } from '@angular/router';
import { ProfissionaisComponent } from './containers/profissionais/profissionais.component';
import { ProfissionaisListComponent } from './components/profissionais-list/profissionais-list.component';

export const ProfissionaisRoutes: Routes = [{
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
    ]
}]