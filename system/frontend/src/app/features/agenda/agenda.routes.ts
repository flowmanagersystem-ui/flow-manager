import { Routes } from '@angular/router';
import { AgendaListComponent } from './components/agenda-list/agenda-list.component';

export const AgendaRoutes: Routes = [{
    path: '',
    children: [
        {
            path: '',
            pathMatch: 'full',
            redirectTo: ''
        },
        {
            path: '',
            component: AgendaListComponent,
            data: { breadcrumb: 'Lista de Clientes' }
        },
    ]
}]