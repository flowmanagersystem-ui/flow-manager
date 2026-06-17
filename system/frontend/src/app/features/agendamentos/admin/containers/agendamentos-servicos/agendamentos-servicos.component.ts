// Angular
import { Component, Renderer2, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// RxJS
import { catchError, finalize, forkJoin, map, Observable, of, tap } from 'rxjs';

// Angular Material
import { MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

// Shared
import { TextFormatted } from '../../../../../shared/text-formatted';

// Pipes
import { DisponiveisCountPipe } from '../../../../../shared/pipes/disponiveis-count.pipe';

// Components
import { ErrorDialogComponent } from '../../../../../shared/components/error-dialog/error-dialog.component';
import { InputErroMsgComponent } from '../../../../../shared/components/input-erro-msg/input-erro-msg.component';

// Interfaces
import { Servico } from '../../../../servicos/servico.interface';
import { Profissional } from '../../../../profissionais/profissional.interface';

// Services
import { ServicosService } from '../../../../servicos/servicos.service';
import { ProfissionaisService } from '../../../../profissionais/profissionais.service';
import { AgendaService, SlotDTO } from '../../../../agenda/agenda.service';

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
    MatInputModule,
    MatSelectModule,   
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    // Components
    InputErroMsgComponent,
    // Pipes
    DisponiveisCountPipe
  ],
  templateUrl: './agendamentos-servicos.component.html',
  styleUrl: './agendamentos-servicos.component.scss'
})

export class AgendamentosServicosComponent implements  OnDestroy,  OnInit {
  private unlistenNext?: () => void
  private unlistenPrev?: () => void
  private mesesCarregados = new Set<string>()
  private mesAtualCalendario = new Date()

  servicos$: Observable<Servico[]> | null = null
  profissionais: Profissional[] = []
  slots: SlotDTO[] = []
  diasDisponiveis: Date[] = []

  carregandoProfissionais = false
  carregandoDias = false
  carregandoSlots = false

  formulario!: FormGroup

  readonly hoje = new Date()

  _renderer = inject(Renderer2)

  constructor(
    public dialogRef: MatDialogRef<AgendamentosServicosComponent>,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,     
    private servicosService: ServicosService,
    private agendaService: AgendaService,
    private fb: NonNullableFormBuilder,    
  ) { }    

  ngOnInit(): void {
    this.formulario = this.fb.group({
      servico:      [null, Validators.required],
      profissional: [null, Validators.required],
      data:         [null, Validators.required],
      horario:      [null, Validators.required],    
    })

    this.buscarServicos()
    this.ouvirMudancas()
  }

  ngOnDestroy() {
    this.unlistenNext?.()
    this.unlistenPrev?.()
  }  

  onSubmit() {
    if (this.formulario.invalid) return

    const { servico, profissional, data, horario } = this.formulario.value
    const [hora, minuto] = horario.split(':').map(Number)
    
    const dataHoraInicio = this.formatarDataHoraCompleta(data, hora, minuto)

    this.dialogRef.close({
      servicoId:        servico.id,
      nomeServico:      servico.nome,
      valorServico:     servico.valor,
      duracao:          servico.duracao,
      profissionalId:   profissional.id,
      nomeProfissional: `${profissional.nome} ${profissional.sobrenome}`,
      horario,
      dataHoraInicio, 
    })
  }

  onControlesCalendario() {
    this.unlistenNext?.()
    this.unlistenPrev?.()
    this.mesAtualCalendario = new Date()

    requestAnimationFrame(() => {
      const nextArrow = document.querySelector('.mat-calendar-next-button')
      const prevArrow  = document.querySelector('.mat-calendar-previous-button')

      if (nextArrow) {
        this.unlistenNext = this._renderer.listen(nextArrow, 'click', () => {
          this.mesAtualCalendario = new Date(
            this.mesAtualCalendario.getFullYear(),
            this.mesAtualCalendario.getMonth() + 1, 1
          );

          this.carregarMesSeNecessario(this.mesAtualCalendario)   

        })
      }

      if (prevArrow) {
        this.unlistenPrev = this._renderer.listen(prevArrow, 'click', () => {
          this.mesAtualCalendario = new Date(
            this.mesAtualCalendario.getFullYear(),
            this.mesAtualCalendario.getMonth() - 1, 1
          )

          this.carregarMesSeNecessario(this.mesAtualCalendario)
        })
      }
    })
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
        this.resetCampos(['profissional', 'data', 'horario'])
        this.profissionais = []
        this.diasDisponiveis = []
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

    // profissional → busca dias disponíveis dos próximos 3 meses
    this.formulario.get('profissional')!.valueChanges
      .subscribe((prof: Profissional) => {
        this.resetCampos(['horario', 'data'])
        this.diasDisponiveis = []
        this.slots = []

        if (!prof?.id) return;

        const servico = this.formulario.get('servico')!.value as Servico
        const hoje = new Date()

        this.carregarProximosMeses(prof.id, servico.id, hoje, 3)
      });

    // data → busca slots disponíveis
    this.formulario.get('data')!.valueChanges
      .subscribe((data: Date) => {
        this.resetCampos(['horario'])
        this.slots = []

        if (!data) return

        const prof = this.formulario.get('profissional')!.value as Profissional
        const servico = this.formulario.get('servico')!.value as Servico


        if (!prof?.id || !servico?.id) return

        const dataStr = this.formatarData(data)

        this.carregandoSlots = true

        this.agendaService.getDisponibilidade(prof.id, servico.id, dataStr)
          .pipe(
            finalize(() => this.carregandoSlots = false)
          )
          .subscribe({
            next: disponibilidade => {
              this.slots = disponibilidade.slots;
            },
            error: () => this.onError('Erro ao carregar horários.')
          });
      });
  }

  carregarProximosMeses(profissionalId: number, servicoId: number, dataBase: Date, qtdMeses: number) {
    this.carregandoDias = true
    this.diasDisponiveis = []
    this.mesesCarregados.clear()

    const requisicoes = Array.from({ length: qtdMeses }, (_, i) => {
    const data = new Date(dataBase.getFullYear(), dataBase.getMonth() + i, 1)
    const chave = `${data.getFullYear()}-${data.getMonth() + 1}`

    this.mesesCarregados.add(chave)
      return this.agendaService.getDiasDisponiveis(
        profissionalId, servicoId,
        data.getFullYear(), data.getMonth() + 1
      );
    });

    forkJoin(requisicoes)
      .pipe(
        finalize(() => this.carregandoDias = false)
      )
      .subscribe({
        next: resultados => {
          this.diasDisponiveis = resultados.flatMap(r =>
            r.diasDisponiveis.map((d: string) => new Date(d + 'T00:00:00'))
          )
        },
        error: () => this.onError('Erro ao carregar disponibilidade.')
      });
  }

  get diasDisponiveisNesteMes(): number {
    return this.diasDisponiveis.filter(d =>
      d.getFullYear() === this.mesAtualCalendario.getFullYear() &&
      d.getMonth() === this.mesAtualCalendario.getMonth()
    ).length
  }

  filtroData = (data: Date | null): boolean => {
    if (!data) return false

    const dataCalendario = new Date(
      data.getFullYear(),
      data.getMonth(),
      data.getDate()
    ).getTime()

    return this.diasDisponiveis.some(d => {
      const disponivel = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate()
      ).getTime()

      return disponivel === dataCalendario
    })
  }

  private formatarData(data: Date): string {
    return data.toISOString().split('T')[0]
  }

  private formatarDataHoraCompleta(data: Date, hora: number, minuto: number): string {
    const dataFormatada = data.toISOString().split('T')[0]
    const horaFormatada = String(hora).padStart(2, '0')
    const minutoFormatado = String(minuto).padStart(2, '0')

    return `${dataFormatada}T${horaFormatada}:${minutoFormatado}:00`
  }
  
  private resetCampos(campos: string[]) {
    const patch: any = {}
  
    campos.forEach(c => patch[c] = null)

    this.formulario.patchValue(patch, { emitEvent: false })
  }

  private carregarMesSeNecessario(data: Date) {
    const ano = data.getFullYear()
    const mes = data.getMonth() + 1
    const chave = `${ano}-${mes}`

    if (this.mesesCarregados.has(chave)) return

    const prof    = this.formulario.get('profissional')!.value as Profissional
    const servico = this.formulario.get('servico')!.value as Servico

    if (!prof?.id || !servico?.id) return

    this.mesesCarregados.add(chave)

    this.agendaService.getDiasDisponiveis(prof.id, servico.id, ano, mes)
      .subscribe({
        next: resultado => {
          const novos = resultado.diasDisponiveis
            .map((d: string) => new Date(d + 'T00:00:00'))

          this.diasDisponiveis = [...this.diasDisponiveis, ...novos]
        },
        error: () => {
          this.mesesCarregados.delete(chave)
          this.onError('Erro ao carregar disponibilidade.')
        }
      });
  }
  
  onError(errorMsg: string, redirectTo?: string) {
    const dialogRef = ErrorDialogComponent.open(this.dialog, { message: errorMsg, redirectTo })

    dialogRef.afterClosed().subscribe(confirmed => {      
      this.router.navigate(['/agendamentos'], { relativeTo: this.route }) // Mudar para rota home ou outra rota adequada
    })
  }

  timeToHourMinute(value: string): string {
    return TextFormatted.timeToHourMinute(value)  
  } 

  textToCurrency(value: number): string {
    return TextFormatted.textToCurrency(value)
  }

}