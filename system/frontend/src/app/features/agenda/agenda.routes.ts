import { Routes } from '@angular/router';

export const AgendaRoutes: Routes = [{
    path: '',
    children: [
        {
            path: '',
            pathMatch: 'full',
            redirectTo: ''
        }
    ]
}]