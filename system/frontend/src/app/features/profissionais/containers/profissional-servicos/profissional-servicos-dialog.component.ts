// Angular
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// RxJS
import { forkJoin, finalize } from 'rxjs';

// Angular Material
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

// Shared
import { TextFormatted } from '../../../../shared/text-formatted';

// Serviços 
import { ProfissionaisService } from '../../profissionais.service';
import { ServicosService } from '../../../servicos/servicos.service';

// Interfaces
import { Servico } from '../../../servicos/servico.interface';

export interface ProfissionalServicosDialogData {
  profissionalId: number
  nomeProfissional: string
}

interface ServicoComSelecao extends Servico {
  selecionado: boolean
  jaVinculado: boolean
}

@Component({
  selector: 'app-profissional-servicos-dialog',
  standalone: true,
  imports: [
    // Angular
    CommonModule,
    // Angular Material
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  templateUrl: './profissional-servicos-dialog.component.html',
  styleUrl: './profissional-servicos-dialog.component.scss'
})
export class ProfissionalServicosDialogComponent implements OnInit {

  servicos: ServicoComSelecao[] = []
  carregando = true
  salvando = false

  get selecionados() {
    return this.servicos.filter(s => s.selecionado)
  }

  get totalAlteracoes() {
    return this.servicos.filter(s => s.selecionado !== s.jaVinculado).length
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ProfissionalServicosDialogData,
    public dialogRef: MatDialogRef<ProfissionalServicosDialogComponent>,
    private profissionaisService: ProfissionaisService,
    private servicosService: ServicosService,
  ) {}

  ngOnInit() {
    forkJoin({
      todos: this.servicosService.listAll(0, 100),
      vinculados: this.profissionaisService.listarServicos(this.data.profissionalId)
    })
    .pipe(finalize(() => this.carregando = false))
    .subscribe({
      next: ({ todos, vinculados }) => {
        const idsVinculados = new Set(vinculados.map((s: Servico) => s.id));
        this.servicos = todos.content.map((s: Servico) => ({
          ...s,
          selecionado: idsVinculados.has(s.id),
          jaVinculado: idsVinculados.has(s.id),
        }));
      },
      error: () => this.dialogRef.close()
    })
  }

  toggleServico(servico: ServicoComSelecao) {
    servico.selecionado = !servico.selecionado
  }

  salvar() {
    const aVincular = this.servicos
      .filter(s => s.selecionado && !s.jaVinculado)
      .map(s => this.profissionaisService.adicionarServico(this.data.profissionalId, s.id))

    const aRemover = this.servicos
      .filter(s => !s.selecionado && s.jaVinculado)
      .map(s => this.profissionaisService.removerServico(this.data.profissionalId, s.id))

    const operacoes = [...aVincular, ...aRemover]

    if (operacoes.length === 0) {
      this.dialogRef.close(false)
      return;
    }

    this.salvando = true;
    forkJoin(operacoes)
      .pipe(finalize(() => this.salvando = false))
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: () => this.dialogRef.close(false)
      })
  }

  categorias() {
    return [...new Set(this.servicos.map(s => s.categoria))].sort()
  }

  servicosPorCategoria(categoria: string) {
    return this.servicos.filter(s => s.categoria === categoria)
  }

  pluralizeServico(count: number) {
    const { singular, plural } = {
      singular: 'serviço selecionado',
      plural: 'serviços selecionados'
    };
    return count === 1 ? singular : plural;
  }

  pluralizeAlteracao(count: number) {
    const { singular, plural } = {
      singular: 'alteração pendente',
      plural: 'alterações pendentes'
    };
    return count === 1 ? singular : plural;
  }

  textToCurrency(value: number): string {
    return TextFormatted.textToCurrency(value)
  }

  secondsToTime(totalSeconds: number): string {
    return TextFormatted.secondsToTime(totalSeconds)
  }
}
