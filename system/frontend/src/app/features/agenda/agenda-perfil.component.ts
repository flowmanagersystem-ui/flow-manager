import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { AuthService } from '../../core/auth/auth.service';
import { AdminAgendaComponent } from './admin/admin-agenda.component';
import { ClienteAgendaComponent } from './cliente/cliente-agenda.component';
import { ProfissionalAgendaComponent } from './profissional/profissional-agenda.component';

@Component({
  selector: 'app-agenda-perfil',
  standalone: true,
  imports: [
    CommonModule,
    AdminAgendaComponent,
    ClienteAgendaComponent,
    ProfissionalAgendaComponent,
  ],
  template: `
    <app-admin-agenda *ngIf="perfil === 'ADMIN'"></app-admin-agenda>
    <app-profissional-agenda *ngIf="perfil === 'PROFISSIONAL'"></app-profissional-agenda>
    <app-cliente-agenda *ngIf="perfil === 'CLIENTE'"></app-cliente-agenda>
  `
})
export class AgendaPerfilComponent {
  perfil = this.authService.getPerfil()

  constructor(private authService: AuthService) {}
}
