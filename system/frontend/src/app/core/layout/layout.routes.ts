import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from '../../features/dashboard/dashboard/dashboard.component';
import { ClienteFormComponent } from '../../features/clientes/containers/cliente-form/cliente-form.component';

export const LayoutRoutes: Routes = [
    {
        path: '',
        component: LayoutComponent,    
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'inicio'
            },
            // {
            //     path: 'inicio',
            //     component: DashboardComponent,
            //     data: { breadcrumb: 'Dashboard' } 
            // },
            {
                path: 'inicio',
                component: ClienteFormComponent,
                data: { breadcrumb: 'Clientes' }
            }
        ]
    }
];