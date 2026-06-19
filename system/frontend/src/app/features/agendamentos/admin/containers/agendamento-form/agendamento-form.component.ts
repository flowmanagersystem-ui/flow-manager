import { delay } from 'rxjs';
// Angular
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, finalize, map, Observable, of, tap } from 'rxjs';

// Material
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

// Validations
import { TextFormatted } from '../../../../../shared/text-formatted';

// Components
import { ErrorDialogComponent } from '../../../../../shared/components/error-dialog/error-dialog.component';
import { InputErroMsgComponent } from '../../../../../shared/components/input-erro-msg/input-erro-msg.component';
import { FormDialogComponent } from '../../../../../shared/components/form-dialog/form-dialog.component';
import { AgendamentosServicosComponent } from '../agendamentos-servicos/agendamentos-servicos.component';

// Interfaces
import { Agendamento, Status } from '../../../agendamento.interface';
import { Cliente } from '../../../../clientes/cliente.interface';

// Services
import { AgendamentosService } from '../../../agendamentos.service';
import { ClientesService } from '../../../../clientes/clientes.service';
import { LoadingService } from '../../../../../shared/services/loading.service';
import { AuthService } from '../../../../../core/auth/auth.service';


@Component({
  selector: 'app-agendamento-form',
  standalone: true,
  imports: [    
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // Material
    MatCardModule, 
    MatFormFieldModule,
    MatInputModule,    
    MatSelectModule,   
    MatIconModule,   
    // Components
    InputErroMsgComponent,
  ],
  templateUrl: './agendamento-form.component.html',
  styleUrl: './agendamento-form.component.scss'
})

export class AgendamentoFormComponent {
  clientes$: Observable<Cliente[]> | null = null
  servicosAdicionados: any[] = []
  agendamento: Agendamento  
  formulario!: FormGroup
  paginaAtual = 0
  isCliente = false

  constructor(    
    private fb: NonNullableFormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,     
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<FormDialogComponent>,
    private loadingService: LoadingService,    
    private agendamentosService: AgendamentosService,
    private clientesService: ClientesService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: { record: Agendamento }
  ){
    this.agendamento = data.record;
  }

  ngOnInit(): void {
    console.log('Agendamento recebido no form:', this.agendamento)
    this.formulario = this.fb.group({
      id:         [this.agendamento?.id],
      cliente:    [null, Validators.required],
      status:     [Status.AGENDADO],
      desconto:   [0],
      observacao: [''],
    })

    this.buscarClientes()
  }

  onSubmit() {
    if (this.formulario.invalid || this.servicosAdicionados.length === 0) return

    // Verificar se a mesmo dia e horario já existe um serviço adicionado
    const existeConflito = this.servicosAdicionados.some(s => {
      const dataHora = new Date(s.dataHoraInicio).getTime()
      return this.servicosAdicionados.some(outro => {
        if (s === outro) return false
        const outroDataHora = new Date(outro.dataHoraInicio).getTime()
        return dataHora === outroDataHora
      })
    })

    if (existeConflito) {
      this.onError('Existe mais de um serviço agendado para o mesmo dia e horário. Por favor, ajuste os horários dos serviços adicionados.')
      return
    }
   
    this.loadingService.show()
    
    const { cliente, status, observacao, desconto } = this.formulario.value;

    const payload = {
      clienteId:  cliente.id,
      status:     Status.AGENDADO,
      observacao: observacao || null,
      desconto:   desconto || 0,
      servicos:   this.servicosAdicionados.map(s => ({
        profissionalId:  s.profissionalId,
        servicoId:       s.servicoId,
        dataHoraInicio:  s.dataHoraInicio  
      }))
    };

    this.agendamentosService.save(payload)
      .pipe(          
        finalize(() => this.loadingService.hide())
      )
      .subscribe({
        next: () => {
          this.snackBar.open('Agendamento confirmado!', '', { duration: 4000 })
          this.dialogRef.close(true)
        },
        error: () => this.onError('Erro ao confirmar agendamento.')
      });
  }

  onCancel(){
    this.formulario.reset()
    this.dialogRef.close(false)
  }

  buscarClientes() {
    this.isCliente = this.authService.getPerfil() === 'CLIENTE'

    if (this.isCliente) {
      this.clientes$ = this.clientesService.loadMe()
        .pipe(
          tap(cliente => this.formulario.get('cliente')?.setValue(cliente)),
          map(cliente => [cliente]),
          catchError(error => {
            this.onError('Erro ao carregar cliente logado.')
            return of([])
          })
        )
      return
    }

    this.clientes$ = this.clientesService.listAll(0, 100, '', true)
    .pipe(
      map(response => response.content),
      catchError(error => {
        this.onError('Erro ao carregar clientes.')
        return of([])
      })
    )
  }

  onAddServices() {
    const dialogRef = this.dialog.open(AgendamentosServicosComponent, {
      width: '560px',
      maxWidth: '100vw',
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.servicosAdicionados.push(result)
      }
    });
  }

  removerServico(index: number) {
    this.servicosAdicionados.splice(index, 1)
  }

  get valorTotal(): number {
    const subtotal = this.servicosAdicionados
      .reduce((acc, s) => acc + s.valorServico, 0)

    const desconto = this.formulario.get('desconto')?.value || 0

    return Math.max(subtotal - desconto, 0)
  }

  onError(errorMsg: string, redirectTo?: string) {

    const dialogRef = ErrorDialogComponent.open(this.dialog, { message: errorMsg, redirectTo })

  }

  textToCurrency(value: number): string {
    return TextFormatted.textToCurrency(value)
  }
}
