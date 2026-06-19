// Angular 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

// RxJS
import { finalize } from 'rxjs';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// FullCalendar
import { CalendarOptions, DatesSetArg, EventClickArg } from '@fullcalendar/core';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';

// Interfaces
import { Agendamento, Status } from '../../agendamentos/agendamento.interface';
import { Page } from '../../../shared/interfaces/page.interface';
import { Profissional } from '../../profissionais/profissional.interface';
import { AgendaEvento, AgendaEventoExtendedProps } from '../shared/agenda-evento.interface';

// Components 
import { AgendamentoEdicaoComponent } from '../../agendamentos/admin/containers/agendamento-edicao/agendamento-edicao.component';
import { FormDialogComponent, ModoFormT } from '../../../shared/components/form-dialog/form-dialog.component';
import { AgendaEventoDialogComponent } from '../shared/agenda-evento-dialog/agenda-evento-dialog.component';

// Services
import { AgendamentosService } from '../../agendamentos/agendamentos.service';
import { ProfissionaisService } from '../../profissionais/profissionais.service';
import { AgendaService } from '../agenda.service';

@Component({
  selector: 'app-admin-agenda',
  standalone: true,
  imports: [
    // Angular
    CommonModule,
    // FullCalendar
    FullCalendarModule,
    // Angular Material
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './admin-agenda.component.html',
  styleUrl: './admin-agenda.component.scss'
})
export class AdminAgendaComponent implements OnInit {
  @ViewChild('calendar') calendar?: FullCalendarComponent

  eventos: AgendaEvento[] = []
  profissionais: Profissional[] = []
  statusOptions = Object.values(Status)
  statusSelecionado: Status | null = null
  profissionalSelecionado: number | null = null
  loading = false
  periodoAtual?: { dataInicio: Date; dataFim: Date }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: ptBrLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    buttonText: {
      today: 'Hoje',
      month: 'Mês',
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
  };

  constructor(
    private agendaService: AgendaService,
    private agendamentosService: AgendamentosService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private profissionaisService: ProfissionaisService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.carregarProfissionais()
  }

  onFiltroChange() {
    this.carregarEventos()
  }

  onLimparFiltros() {
    this.profissionalSelecionado = null
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
        actions: ['editar', 'cancelar']
      }
    })

    dialogRef.afterClosed().subscribe(action => {
      if (action === 'editar') {
        this.onEditar(evento)
      }

      if (action === 'cancelar') {
        this.onCancelar(evento)
      }
    })
  }

  private carregarEventos() {
    if (!this.periodoAtual) return

    this.loading = true
    this.cdr.detectChanges()

    this.agendaService.getEventos({
      ...this.periodoAtual,
      profissionalId: this.profissionalSelecionado,
      status: this.statusSelecionado
    })
      .pipe(finalize(() => {
        this.loading = false;
        this.cdr.detectChanges()
      }))
      .subscribe({
        next: eventos => {
          this.eventos = eventos;
          this.calendarOptions = {
            ...this.calendarOptions,
            events: eventos
          }
        },
        error: () => {
          this.snackBar.open('Erro ao carregar eventos da agenda.', 'Fechar', { duration: 5000 })
        }
      });
  }

  private carregarProfissionais() {
    this.profissionaisService.listAll(0, 100)
      .subscribe({
        next: (page: Page<Profissional>) => this.profissionais = page.content,
        error: () => this.snackBar.open('Erro ao carregar profissionais.', 'Fechar', { duration: 5000 })
      })
  }

  private onEditar(evento: AgendaEventoExtendedProps) {
    const dialogRef = FormDialogComponent.open<Agendamento>(this.dialog, {
      title: 'Editar Agendamento',
      subtitle: 'Edite status, observação, desconto e os serviços do agendamento.',
      modo: ModoFormT.EDITAR,
      record: this.toAgendamento(evento),
      component: AgendamentoEdicaoComponent,
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.carregarEventos();
      }
    })
  }

  private onCancelar(evento: AgendaEventoExtendedProps) {
    this.agendamentosService.updateStatus(evento.agendamentoId, Status.CANCELADO)
      .subscribe({
        next: () => {
          this.snackBar.open('Agendamento cancelado com sucesso.', 'Fechar', { duration: 4000 });
          this.carregarEventos();
        },
        error: () => this.snackBar.open('Erro ao cancelar agendamento.', 'Fechar', { duration: 5000 })
      });
  }

  private toAgendamento(evento: AgendaEventoExtendedProps): Agendamento {
    return {
      id: evento.agendamentoId,
      clienteId: evento.clienteId,
      nomeCliente: evento.nomeCliente,
      dataHora: evento.dataHoraInicio,
      status: evento.status,
      observacao: evento.observacao || '',
      desconto: evento.desconto || 0,
      valorTotal: evento.valorTotal,
      servicos: evento.servicos.map(servico => ({
        profissionalId: servico.profissionalId,
        nomeProfissional: servico.nomeProfissional,
        servicoId: servico.servicoId,
        nomeServico: servico.nomeServico,
        valorServico: servico.valorServico,
        duracao: servico.duracao,
        dataHoraInicio: servico.dataHoraInicio,
        dataHoraFim: servico.dataHoraFim
      }))
    };
  }

}
