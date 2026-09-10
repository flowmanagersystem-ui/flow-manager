import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { AgendamentosServicosComponent } from '../admin/containers/agendamentos-servicos/agendamentos-servicos.component'
import { TextFormatted } from '../../../shared/text-formatted'

@Component({
  selector: 'app-remarcar-agendamento',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title>Remarcar Agendamento</h2>

    <mat-dialog-content>
      <div class="service-row" *ngFor="let servico of servicosAdicionados; let i = index">
        <mat-icon>event_available</mat-icon>
        <div>
          <strong>{{ servico.nomeServico }}</strong>
          <span>{{ servico.nomeProfissional }} · {{ servico.horario }}</span>
        </div>
        <button mat-icon-button (click)="removerServico(i)" matTooltip="Remover">
          <mat-icon>delete</mat-icon>
        </button>
      </div>

      <p *ngIf="servicosAdicionados.length === 0">Nenhum serviço adicionado ainda.</p>

      <button class="btn btn-full" matButton="filled" (click)="onAddServices()">
        <mat-icon>add</mat-icon> Adicionar serviço
      </button>

      <div class="total" *ngIf="servicosAdicionados.length > 0">
        <span>Total</span>
        <strong>{{ textToCurrency(valorTotal) }}</strong>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" (click)="onSubmit()" [disabled]="servicosAdicionados.length === 0">
        Confirmar
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `      
    .btn-full{
      width: 100%;
      display: flex;
      justify-content: center;
      background-color: var(--primary);
      color: #fff;
      margin-bottom: 39px;
      transition: opacity 0.15s;
    }
    `
  ]
})
export class RemarcarAgendamentoComponent {
  servicosAdicionados: any[] = []

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<RemarcarAgendamentoComponent>,
  ) {}

  onAddServices() {
    const dialogRef = this.dialog.open(AgendamentosServicosComponent, {
      width: '560px',
      maxWidth: '100vw',
      maxHeight: '90vh',
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.servicosAdicionados.push(result)
      }
    })
  }

  removerServico(index: number) {
    this.servicosAdicionados.splice(index, 1)
  }

  onSubmit() {
    if (this.servicosAdicionados.length === 0) return

    const existeConflito = this.servicosAdicionados.some(s => {
      const dataHora = new Date(s.dataHoraInicio).getTime()
      return this.servicosAdicionados.some(outro =>
        outro !== s && new Date(outro.dataHoraInicio).getTime() === dataHora
      )
    })

    if (existeConflito) {
      return
    }

    this.dialogRef.close(
      this.servicosAdicionados.map(s => ({
        profissionalId: s.profissionalId,
        servicoId: s.servicoId,
        dataHoraInicio: s.dataHoraInicio,
      }))
    )
  }

  get valorTotal(): number {
    return this.servicosAdicionados.reduce((acc, s) => acc + s.valorServico, 0)
  }

  textToCurrency(value: number): string {
    return TextFormatted.textToCurrency(value)
  }
}