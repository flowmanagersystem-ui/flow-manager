// import { Routes } from '@angular/router';
// import { LayoutComponent } from './layout/layout.component';
// import { DashboardComponent } from '../../features/dashboard/dashboard/dashboard.component';

// export const LayoutRoutes: Routes = [
//     {
//         path: '',
//         component: LayoutComponent,    
//         children: [
//             {
//                 path: '',
//                 pathMatch: 'full',
//                 redirectTo: 'agendamentos'
//             },
//             {
//                 path: 'inicio',
//                 component: DashboardComponent,
//                 data: { breadcrumb: 'Dashboard' } 
//             },
//             {
//                 path: 'agendamentos',
//                 loadChildren: () => import('../../features/agendamentos/agendamentos.routes').then(m => m.AgendamentosRoutes),
//                 data: { breadcrumb: 'Agendamentos' }
//             },
//             {
//                 path: 'clientes',
//                 loadChildren: () => import('../../features/clientes/cliente.routes').then(m => m.ClientesRoutes),
//                 data: { breadcrumb: 'Clientes' }
//             },
//             {
//                 path: 'profissionais',
//                 loadChildren: () => import('../../features/profissionais/profissinal.routes').then(m => m.ProfissinalRoutes),
//                 data: { breadcrumb: 'Profissionais' }
//             },
//             {
//                 path: 'servicos',
//                 loadChildren: () => import('../../features/servicos/servico.routes').then(m => m.servicosRoutes),
//                 data: { breadcrumb: 'Serviços' }
//             }
//         ]
//     }
// ]