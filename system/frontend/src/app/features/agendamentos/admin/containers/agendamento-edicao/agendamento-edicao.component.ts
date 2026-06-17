// Angular
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// RxJS
import { finalize } from 'rxjs';

// Angular Material
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

// Shared
import { TextFormatted } from '../../../../../shared/text-formatted';

// Components
import { AgendamentosServicosComponent } from '../agendamentos-servicos/agendamentos-servicos.component';
import { ErrorDialogComponent } from '../../../../../shared/components/error-dialog/error-dialog.component';
import { FormDialogComponent } from '../../../../../shared/components/form-dialog/form-dialog.component';
import { InputErroMsgComponent } from '../../../../../shared/components/input-erro-msg/input-erro-msg.component';

// Interfaces
import { Agendamento, ServicoAgendamento, Status } from '../../../agendamento.interface';

// Services
import { AgendamentosService } from '../../../agendamentos.service';
import { LoadingService } from '../../../../../shared/services/loading.service';

@Component({
  selector: 'app-agendamento-edicao',
  standalone: true,
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Angular Material
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    // Components
    InputErroMsgComponent,
  ],
  templateUrl: './agendamento-edicao.component.html',
  styleUrl: './agendamento-edicao.component.scss'
})
export class AgendamentoEdicaoComponent {
  agendamento: Agendamento
  formulario!: FormGroup
  servicosAgendamento: ServicoAgendamento[] = []
  statusOptions = Object.values(Status)

  constructor(
    private fb: NonNullableFormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<FormDialogComponent>,
    private loadingService: LoadingService,
    private agendamentosService: AgendamentosService,
    @Inject(MAT_DIALOG_DATA) public data: { record: Agendamento }
  ) {
    this.agendamento = data.record
  }

  ngOnInit(): void {
    this.formulario = this.fb.group({
      id: [this.agendamento?.id],
      status: [this.agendamento?.status || Status.AGENDADO, Validators.required],
      desconto: [this.agendamento?.desconto || 0],
      observacao: [this.agendamento?.observacao || ''],
    })

    this.servicosAgendamento = (this.agendamento?.servicos || [])
      .map(servico => ({
        ...servico,
        horario: this.horarioServico(servico)
      }))
  }

  onSubmit() {
    if (this.formulario.invalid || this.servicosAgendamento.length === 0) {
      this.formulario.markAllAsTouched()
      return
    }

    // O mesmo serviço não pode ser adicionado mais de uma vez para o mesmo profissional.
    if (this.servicosAgendamento.some((s, index, self) => {
      return self.findIndex(other => 
        other.profissionalId === s.profissionalId && 
        other.servicoId === s.servicoId
      ) !== index
    })) {
      this.onError('O mesmo serviço não pode ser adicionado mais de uma vez para o mesmo profissional no agendamento.')
      return
    }

    this.loadingService.show()

    const { id, status, observacao, desconto } = this.formulario.value

    const payload = {
      id,
      clienteId: this.agendamento.clienteId,
      status,
      observacao: observacao || null,
      desconto: desconto || 0,
      servicos: this.servicosAgendamento.map(s => ({
        profissionalId: s.profissionalId,
        servicoId: s.servicoId,
        dataHoraInicio: s.dataHoraInicio
      }))
    } as Agendamento

    this.agendamentosService.save(payload)
      .pipe(
        finalize(() => this.loadingService.hide())
      )
      .subscribe({
        next: () => {
          this.snackBar.open('Agendamento editado com sucesso!', '', { duration: 4000 })
          this.dialogRef.close(true)
        },
        error: () => this.onError('Erro ao editar agendamento.')
      });
  }

  onCancel() {
    this.formulario.reset()
    this.dialogRef.close(false)
  }

  onAddServico() {
    const dialogRef = this.dialog.open(AgendamentosServicosComponent, {
      width: '560px',
      maxWidth: '100vw',
      maxHeight: '90vh',
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.servicosAgendamento.push(result)
      }
    });
  }

  onEditServico(index: number) {
    const dialogRef = this.dialog.open(AgendamentosServicosComponent, {
      width: '560px',
      maxWidth: '100vw',
      maxHeight: '90vh',
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.servicosAgendamento[index] = result
      }
    });
  }

  onRemoveServico(index: number) {
    this.servicosAgendamento.splice(index, 1)
  }

  get subtotal(): number {
    return this.servicosAgendamento
      .reduce((acc, servico) => acc + (servico.valorServico || 0), 0)
  }

  get valorTotal(): number {
    const desconto = this.formulario.get('desconto')?.value || 0

    return Math.max(this.subtotal - desconto, 0)
  }

  onError(errorMsg: string, redirectTo?: string) {
    const dialogRef = ErrorDialogComponent.open(this.dialog, { message: errorMsg, redirectTo })

    dialogRef.afterClosed().subscribe(confirmed => {
      this.router.navigate([''], { relativeTo: this.route })
    })
  }

  textToCurrency(value?: number): string {
    return TextFormatted.textToCurrency(value || 0)
  }

  textToDateTime(value?: string): string {
    if (!value) return ''

    return TextFormatted.textToDateTime(value)
  }

  capitalizarTexto(texto: string): string {
    return TextFormatted.capitalizarTexto(texto)
  }

  private horarioServico(servico: ServicoAgendamento): string {
    if (servico.horario) return servico.horario
    if (!servico.dataHoraInicio) return ''

    return servico.dataHoraInicio.substring(11, 16)
  }
}
