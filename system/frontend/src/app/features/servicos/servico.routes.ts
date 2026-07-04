import { Routes } from '@angular/router';
import { ServicosComponent } from './containers/servicos/servicos.component';


export const ServicosRoutes: Routes = [{
    path: '',
    children: [
        {
            path: '',
            pathMatch: 'full',
            redirectTo: ''
        },
        {
            path: '',
            component: ServicosComponent,
            data: { breadcrumb: 'Lista de Serviços' }
        }
    ]
}]