import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { catchError, finalize, map, of, tap } from 'rxjs';

import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Agendamento, ServicoAgendamento, Status } from '../../../agendamento.interface';
import { AgendamentosService } from '../../../agendamentos.service';
import { TextFormatted } from '../../../../../shared/text-formatted';

@Component({
  selector: 'app-profissional-agendamentos',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './profissional-agendamentos.component.html',
  styleUrl: './profissional-agendamentos.component.scss'
})
export class ProfissionalAgendamentosComponent implements OnInit {
  agendamentos: Agendamento[] = []
  totalElements = 0
  paginaAtual = 0
  loading = false
  updatingId: number | null = null

  readonly Status = Status

  constructor(
    private agendamentosService: AgendamentosService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.refresh()
  }

  refresh(page = 0) {
    this.paginaAtual = page
    this.loading = true

    this.agendamentosService.listAll(page)
      .pipe(
        tap(response => this.totalElements = response.totalElements),
        map(response => response.content),
        catchError(() => {
          this.snackBar.open('Erro ao carregar seus agendamentos.', 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          })
          return of([])
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(agendamentos => this.agendamentos = agendamentos)
  }

  onPageChange(event: PageEvent) {
    this.refresh(event.pageIndex)
  }

  updateStatus(agendamento: Agendamento, status: Status) {
    if (!agendamento.id || this.updatingId) {
      return
    }

    this.updatingId = agendamento.id

    this.agendamentosService.updateStatus(agendamento.id, status)
      .pipe(finalize(() => this.updatingId = null))
      .subscribe({
        next: agendamentoAtualizado => {
          this.agendamentos = this.agendamentos.map(item =>
            item.id === agendamentoAtualizado.id ? agendamentoAtualizado : item
          )
          this.snackBar.open('Status atualizado com sucesso.', 'Fechar', {
            duration: 4000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          })
        },
        error: () => {
          this.snackBar.open('Não foi possível atualizar o status.', 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          })
        }
      })
  }

  canUpdateStatus(agendamento: Agendamento): boolean {
    return agendamento.status !== Status.CONCLUIDO && agendamento.status !== Status.CANCELADO
  }

  primeirosServicos(agendamento: Agendamento): ServicoAgendamento[] {
    return agendamento.servicos.slice(0, 2)
  }

  servicosRestantes(agendamento: Agendamento): string {
    return agendamento.servicos
      .slice(2)
      .map((servico: ServicoAgendamento) => servico.nomeServico)
      .join(', ')
  }

  profissionaisUnicos(agendamento: Agendamento): string[] {
    return [...new Set(agendamento.servicos
      .map((servico: ServicoAgendamento) => servico.nomeProfissional)
      .filter((nome): nome is string => !!nome))]
  }

  textToCurrency(value?: number): string {
    return TextFormatted.textToCurrency(value || 0)
  }

  textToDateTime(value?: string): string {
    return value ? TextFormatted.textToDateTime(value) : '-'
  }

  capitalizarTexto(texto: string): string {
    return TextFormatted.capitalizarTexto(texto)
  }
}
