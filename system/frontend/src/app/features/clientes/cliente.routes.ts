import { Routes } from '@angular/router';
import { ClienteFormComponent } from './containers/cliente-form/cliente-form.component';
import { ClientesComponent } from './containers/clientes/clientes.component';

export const ClientesRoutes: Routes = [{
    path: '',
    children: [
        {
            path: '',
            pathMatch: 'full',
            redirectTo: ''
        },
        {
            path: '',
            component: ClientesComponent,
            data: { breadcrumb: 'Lista de Clientes' }
        },
        {
            path: 'novo',
            component: ClienteFormComponent,
            data: { breadcrumb: 'Novo Cliente' }
        }

    ]
}]