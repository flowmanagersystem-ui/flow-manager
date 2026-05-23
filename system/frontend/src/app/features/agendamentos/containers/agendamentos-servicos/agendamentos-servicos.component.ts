// Angular
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// RxJS
import { catchError, finalize, map, Observable, of, tap } from 'rxjs';

// Angular Material
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';

// Shared
import { TextFormatted } from '../../../../shared/text-formatted';
// Pipes
import { DisponiveisCountPipe } from '../../../../shared/pipes/disponiveis-count.pipe';

// Components
import { ErrorDialogComponent } from '../../../../shared/components/error-dialog/error-dialog.component';
import { InputErroMsgComponent } from '../../../../shared/components/input-erro-msg/input-erro-msg.component';

// Interfaces
import { Servico } from '../../../servicos/servico.interface';
import { Profissional } from '../../../profissionais/profissional.interface';

// Services
import { ServicosService } from '../../../servicos/servicos.service';
import { ProfissionaisService } from '../../../profissionais/profissionais.service';
import { AgendaService, SlotDTO } from '../../../agenda/agenda.service';

@Component({
  selector: 'app-agendamentos-servicos',
  standalone: true,
  imports: [    
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Angular Material
    MatCardModule, 
    MatFormFieldModule,
    MatSelectModule,   
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatRadioModule,
    // Components
    InputErroMsgComponent,
    // Pipes
    DisponiveisCountPipe
  ],
  templateUrl: './agendamentos-servicos.component.html',
  styleUrl: './agendamentos-servicos.component.scss'
})
export class AgendamentosServicosComponent {
  servicos$: Observable<Servico[]> | null = null
  profissionais: Profissional[] = []
  slots: SlotDTO[] = []
  diasDisponiveis: string[] = []
  carregandoProfissionais = false
  carregandoSlots = false
  horariosDisponiveis: string[] = []
  formulario!: FormGroup

  readonly DIAS = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM']

  readonly DIAS_MAP: Record<string, string> = {
    SEG: 'Seg', TER: 'Ter', QUA: 'Qua',
    QUI: 'Qui', SEX: 'Sex', SAB: 'Sáb', DOM: 'Dom'
  }
  
  constructor(
    public dialogRef: MatDialogRef<AgendamentosServicosComponent>,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,     
    private servicosService: ServicosService,
    private profissionaisService: ProfissionaisService,
    private agendaService: AgendaService,
    private fb: NonNullableFormBuilder,    
  ) { }

  ngOnInit(): void {
   this.formulario = this.fb.group({
      servico:      [null, Validators.required],
      profissional: [null, Validators.required],
      diaSemana:    [null, Validators.required],
      horario:      [null, Validators.required],
    })

    this.buscarServicos()
    this.ouvirMudancas()
  }


  buscarServicos() {
    this.servicos$ = this.servicosService.listAll(0, 100)
    .pipe(
      map(response => response.content),
      catchError(error => {
        this.onError('Erro ao carregar serviços.');
        return of([]);
      })
    )
  }

  ouvirMudancas() {
    this.formulario.get('servico')!.valueChanges
      .subscribe((servico: Servico) => {
        this.resetCampos(['profissional', 'diaSemana', 'horario'])
        this.profissionais = []
        this.diasDisponiveis = []
        this.horariosDisponiveis = []
        this.slots = [] 

        if (!servico?.id) return

        this.carregandoProfissionais = true
      
        this.servicosService.listarProfissionaisPorServico(servico.id)
          .pipe(
            finalize(() => this.carregandoProfissionais = false)
          )
          .subscribe({
            next: profs => this.profissionais = profs,
            error: () => this.onError('Erro ao carregar profissionais.')
          })      
    });

    // ao mudar profissional → carrega horários e extrai dias disponíveis
    this.formulario.get('profissional')!.valueChanges
      .subscribe((prof: Profissional) => {
        this.resetCampos(['diaSemana', 'horario'])
        this.diasDisponiveis = []
        this.horariosDisponiveis = []  
        this.slots = []   

        if (!prof?.id) return
        
        this.profissionaisService.listarHorarios(prof.id)
          .subscribe({
            next: horarios => {
              // extrai dias únicos com horário cadastrado
              this.diasDisponiveis = [...new Set(horarios.map(h => h.diaSemana))]
            },

            error: (err) => {
              console.error('Erro:', err);
              this.onError('Erro ao carregar horários.');
            }
          });        
    });

    // ao mudar dia → gera slots baseado na duração do serviço
    this.formulario.get('diaSemana')!.valueChanges
      .subscribe((dia: string) => {
        this.resetCampos(['horario'])
        this.slots = []

      const profi = this.formulario.get('profissional')!.value as Profissional
      const servico = this.formulario.get('servico')!.value as Servico

      if (!profi?.id || !dia || !servico?.duracao) return

      this.carregandoSlots = true
      this.agendaService.getDisponibilidade(profi.id, dia, servico.id)
        .pipe(
          finalize(() => this.carregandoSlots = false)          
        )
        .subscribe({
          next: disponibilidade =>  this.slots = disponibilidade.slots,          
          error: () => this.onError('Erro ao carregar horários disponíveis.')
        })
    });
  }

  onSubmit() {
    if (this.formulario.invalid) return

    const { servico, profissional, diaSemana, horario } = this.formulario.value

    this.dialogRef.close({
      servicoId:       servico.id,
      nomeServico:     servico.nome,
      valorServico:    servico.valor,
      duracao:         servico.duracao,
      profissionalId:  profissional.id,
      nomeProfissional: `${profissional.nome} ${profissional.sobrenome}`,
      diaSemana,
      horario,
    });
  }

  labelDia(key: string): string {
    return this.DIAS_MAP[key] ?? key
  }

  diaDisponivel(dia: string): boolean {
    return this.diasDisponiveis.includes(dia)
  }

  private resetCampos(campos: string[]) {
    const patch: any = {};
    campos.forEach(c => patch[c] = null);
    this.formulario.patchValue(patch);
  }
  
  onError(errorMsg: string, redirectTo?: string) {
    const dialogRef = ErrorDialogComponent.open(this.dialog, { message: errorMsg, redirectTo })

    dialogRef.afterClosed().subscribe(confirmed => {      
      this.router.navigate([''], { relativeTo: this.route }) // Mudar para rota home ou outra rota adequada
    })
  }

  capitalizarTexto(texto: string): string {
    return TextFormatted.capitalizarTexto(texto)
  }

  timeToHourMinute(value: string): string {
    return TextFormatted.timeToHourMinute(value)  
  }
  

}