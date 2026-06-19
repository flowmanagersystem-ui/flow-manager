import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CalendarOptions, DatesSetArg, EventClickArg } from '@fullcalendar/core';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { FullCalendarModule } from '@fullcalendar/angular';
import { finalize } from 'rxjs';

import { Agendamento, Status } from '../../agendamentos/agendamento.interface';
import { AgendamentoFormComponent } from '../../agendamentos/admin/containers/agendamento-form/agendamento-form.component';
import { AgendamentosService } from '../../agendamentos/agendamentos.service';
import { FormDialogComponent, ModoFormT } from '../../../shared/components/form-dialog/form-dialog.component';
import { AgendaService } from '../agenda.service';
import { AgendaEvento, AgendaEventoExtendedProps } from '../shared/agenda-evento.interface';
import { AgendaEventoDialogComponent } from '../shared/agenda-evento-dialog/agenda-evento-dialog.component';

@Component({
  selector: 'app-cliente-agenda',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './cliente-agenda.component.html',
  styleUrl: './cliente-agenda.component.scss'
})
export class ClienteAgendaComponent {
  eventos: AgendaEvento[] = []
  loading = false
  periodoAtual?: { dataInicio: Date; dataFim: Date }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: ptBrLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek'
    },
    buttonText: {
      today: 'Hoje',
      month: 'Mês',
      week: 'Semana'
    },
    allDaySlot: false,
    nowIndicator: true,
    height: 'auto',
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false
    },
    events: [],
    datesSet: (info) => this.onDatesSet(info),
    eventClick: (info) => this.onEventClick(info),
  }

  constructor(
    private agendaService: AgendaService,
    private agendamentosService: AgendamentosService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  onNovoAgendamento() {
    const dialogRef = FormDialogComponent.open<Agendamento>(this.dialog, {
      title: 'Novo Agendamento',
      subtitle: 'Escolha o serviço, profissional e horário para confirmar seu agendamento.',
      modo: ModoFormT.CRIAR,
      component: AgendamentoFormComponent,
    })

    console.log('Dialog aberto para novo agendamento.')

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.carregarEventos()
      }
    })
  }

  private onDatesSet(info: DatesSetArg) {
    this.periodoAtual = {
      dataInicio: info.start,
      dataFim: info.end
    }
    this.carregarEventos()
  }

  private onEventClick(info: EventClickArg) {
    const evento = info.event.extendedProps as AgendaEventoExtendedProps

    const dialogRef = this.dialog.open(AgendaEventoDialogComponent, {
      width: '560px',
      maxWidth: '95vw',
      data: {
        evento,
        actions: ['cancelar']
      }
    })

    dialogRef.afterClosed().subscribe(action => {
      if (action === 'cancelar') {
        this.cancelarAgendamento(evento.agendamentoId)
      }
    })
  }

  private carregarEventos() {
    if (!this.periodoAtual) return

    this.loading = true
    this.agendaService.getEventos(this.periodoAtual)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: eventos => {
          this.eventos = eventos
          this.calendarOptions = {
            ...this.calendarOptions,
            events: eventos
          }
        },
        error: () => this.snackBar.open('Erro ao carregar sua agenda.', 'Fechar', { duration: 5000 })
      })
  }

  private cancelarAgendamento(id: number) {
    this.agendamentosService.updateStatus(id, Status.CANCELADO)
      .subscribe({
        next: () => {
          this.snackBar.open('Agendamento cancelado com sucesso.', 'Fechar', { duration: 4000 })
          this.carregarEventos()
        },
        error: () => this.snackBar.open('Erro ao cancelar agendamento.', 'Fechar', { duration: 5000 })
      })
  }
}
