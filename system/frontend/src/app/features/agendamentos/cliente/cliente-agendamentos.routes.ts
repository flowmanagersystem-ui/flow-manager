import { Routes } from '@angular/router';


export const ClienteAgendamentosRoutes: Routes = [{
    path: '',
    children: [
        {
            path: '',
            pathMatch: 'full',
            redirectTo: ''
        }
    ]
}]