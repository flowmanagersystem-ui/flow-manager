import { Routes } from '@angular/router';


export const MeuPerfilRoutes: Routes = [{
    path: '',
    children: [
        {
            path: '',
            pathMatch: 'full',
            redirectTo: ''
        }
    ]
}]