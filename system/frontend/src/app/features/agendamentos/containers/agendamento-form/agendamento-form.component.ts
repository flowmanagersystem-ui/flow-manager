import { delay } from 'rxjs';
// Angular
import { Component, Inject } from '@angular/core';
import { CommonModule, Location  } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncValidatorFn, FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { FormValidations } from '../../../../shared/forms-validations';
import { TextFormatted } from '../../../../shared/text-formatted';

// Diretivas
import { CurrencyFormatDirective } from '../../../../shared/directives/currencyFormat.directive';
import { TimeFormatDirective } from '../../../../shared/directives/timeFormat.directive';

// Components
import { ErrorDialogComponent } from '../../../../shared/components/error-dialog/error-dialog.component';
import { InputErroMsgComponent } from '../../../../shared/components/input-erro-msg/input-erro-msg.component';
import { FormDialogComponent } from '../../../../shared/components/form-dialog/form-dialog.component';
import { AgendamentosServicosComponent } from '../agendamentos-servicos/agendamentos-servicos.component';

// Interfaces
import { Agendamento, Status } from '../../agendamento.interface';
import { Cliente } from '../../../clientes/cliente.interface';

// Services
import { AgendamentosService } from '../../agendamentos.service';
import { ClientesService } from '../../../clientes/clientes.service';
import { LoadingService } from '../../../../shared/services/loading.service';


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


  constructor(    
    private fb: NonNullableFormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,     
    private location : Location,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<FormDialogComponent>,
    private loadingService: LoadingService,    
    private agendamentosService: AgendamentosService,
    private clientesService: ClientesService,
    @Inject(MAT_DIALOG_DATA) public data: { record: Agendamento }
  ){
    this.agendamento = data.record;
  }

  ngOnInit(): void {
    this.formulario = this.fb.group({
      id:         [this.agendamento?.id],
      cliente:    [null, Validators.required],
      desconto:   [0],
      observacao: [''],
    })

    this.buscarClientes()
  }

  onSubmit() {
    if (this.formulario.invalid || this.servicosAdicionados.length === 0) return

    const dto = {
      clienteId: parseInt(this.formulario.get('cliente')?.value?.id),
      status: Status.AGENDADO,
      observacao: String(this.formulario.get('observacao')?.value),
      desconto: parseFloat(this.formulario.get('desconto')?.value) || 0,
      dataHora: '2026-05-25T08:00:00',
      servicos: this.servicosAdicionados.map(s => ({
        profissionalId: parseInt(s.profissionalId),
        servicoId: parseInt(s.servicoId),
      }))
    }

    console.log(dto)

    this.agendamentosService.save(dto)
      .subscribe({
        next: () => {
          this.snackBar.open('Agendamento confirmado!', '', { duration: 4000 });
          this.dialogRef.close(true);
        },
        error: () => this.onError('Erro ao confirmar agendamento.')
      });
  }


  onCancel(){}

  buscarClientes() {
    this.clientes$ = this.clientesService.listAll(0)
    .pipe(
      map(response => response.content.filter(cliente => String(cliente.status) == 'Ativo')),
      catchError(error => {
        this.onError('Erro ao carregar clientes.');
        return of([]);
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
    this.servicosAdicionados.splice(index, 1);
  }

  get valorTotal(): number {
    const subtotal = this.servicosAdicionados
      .reduce((acc, s) => acc + s.valorServico, 0)

    const desconto = this.formulario.get('desconto')?.value || 0

    return Math.max(subtotal - desconto, 0)
  }

  onError(errorMsg: string, redirectTo?: string) {

    const dialogRef = ErrorDialogComponent.open(this.dialog, { message: errorMsg, redirectTo })

    dialogRef.afterClosed().subscribe(confirmed => {      
      this.router.navigate([''], { relativeTo: this.route }) // Mudar para rota home ou outra rota adequada
    })
  }

  textToCurrency(value: number): string {
    return TextFormatted.textToCurrency(value)
  }
}
