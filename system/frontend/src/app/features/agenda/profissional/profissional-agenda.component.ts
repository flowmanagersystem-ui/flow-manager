import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CalendarOptions, DatesSetArg, EventClickArg } from '@fullcalendar/core';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { FullCalendarModule } from '@fullcalendar/angular';
import { finalize } from 'rxjs';

import { Status } from '../../agendamentos/agendamento.interface';
import { AgendamentosService } from '../../agendamentos/agendamentos.service';
import { AgendaService } from '../agenda.service';
import { AgendaEvento, AgendaEventoExtendedProps } from '../shared/agenda-evento.interface';
import { AgendaEventoDialogComponent } from '../shared/agenda-evento-dialog/agenda-evento-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-profissional-agenda',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './profissional-agenda.component.html',
  styleUrl: './profissional-agenda.component.scss'
})
export class ProfissionalAgendaComponent {
  eventos: AgendaEvento[] = []
  loading = false
  periodoAtual?: { dataInicio: Date; dataFim: Date }

  statusOptions = Object.values(Status)
  statusSelecionado: Status | null = null

  calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    locale: ptBrLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay'
    },
    buttonText: {
      today: 'Hoje',
      week: 'Semana',
      day: 'Dia'
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

  onFiltroChange() {
    this.carregarEventos()
  }

  onLimparFiltros() {
    this.statusSelecionado = null
    this.carregarEventos()
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
        actions: ['concluir', 'cancelar']
      }
    })

    dialogRef.afterClosed().subscribe(action => {
      if (action === 'concluir') {
        this.atualizarStatus(evento.agendamentoId, Status.CONCLUIDO)
      }

      if (action === 'cancelar') {
        this.atualizarStatus(evento.agendamentoId, Status.CANCELADO)
      }
    })
  }

  private carregarEventos() {
    if (!this.periodoAtual) return

    this.loading = true
    this.agendaService.getEventos({
      ...this.periodoAtual,
      status: this.statusSelecionado || undefined})
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

  private atualizarStatus(id: number, status: Status) {
    this.agendamentosService.updateStatus(id, status)
      .subscribe({
        next: () => {
          this.snackBar.open('Status atualizado com sucesso.', 'Fechar', { duration: 4000 })
          this.carregarEventos()
        },
        error: () => this.snackBar.open('Erro ao atualizar status.', 'Fechar', { duration: 5000 })
      })
  }
}
