// Angular
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// RxJS
import { finalize } from 'rxjs/operators';

// Angular Material
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

// Serviços
import { ProfissionaisService } from '../../profissionais.service';

// Interfaces
import { DiaSemana } from './horario-atendimento.interface';

export interface HorarioDialogData {
  profissionalId: number;
  nomeProfissional: string;
}

interface Slot {
  id?: number;
  horaInicio: string;
  horaFim: string;
  editando: boolean;
  horaInicioEdit: string;
  horaFimEdit: string;
}

interface DiaAtendimento {
  key: DiaSemana;
  label: string;
  slots: Slot[];
  adicionando: boolean;
  novoInicio: string;
  novoFim: string;
}

@Component({
  selector: 'app-horario-atendimento-dialog',
  standalone: true,
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    // Angular Material
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './horario-atendimento-dialog.component.html',
  styleUrl: './horario-atendimento-dialog.component.scss'
})
export class HorarioAtendimentoDialogComponent implements OnInit {

  carregando = true
  salvando = false

  dias: DiaAtendimento[] = [
    { key: DiaSemana.SEG, label: 'Segunda', slots: [], adicionando: false, novoInicio: '08:00', novoFim: '12:00' },
    { key: DiaSemana.TER, label: 'Terça',   slots: [], adicionando: false, novoInicio: '08:00', novoFim: '12:00' },
    { key: DiaSemana.QUA, label: 'Quarta',  slots: [], adicionando: false, novoInicio: '08:00', novoFim: '12:00' },
    { key: DiaSemana.QUI, label: 'Quinta',  slots: [], adicionando: false, novoInicio: '08:00', novoFim: '12:00' },
    { key: DiaSemana.SEX, label: 'Sexta',   slots: [], adicionando: false, novoInicio: '08:00', novoFim: '12:00' },
    { key: DiaSemana.SAB, label: 'Sábado',  slots: [], adicionando: false, novoInicio: '08:00', novoFim: '12:00' },
    { key: DiaSemana.DOM, label: 'Domingo', slots: [], adicionando: false, novoInicio: '08:00', novoFim: '12:00' },
  ]

  constructor(
    public dialogRef: MatDialogRef<HorarioAtendimentoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HorarioDialogData,
    private profissionaisService: ProfissionaisService
  ) {}

  ngOnInit() {
    this.profissionaisService.listarHorarios(this.data.profissionalId)
      .pipe(finalize(() => this.carregando = false))
      .subscribe({
        next: (horarios: any[]) => {
          horarios.forEach(h => {
            const dia = this.dias.find(d => d.key === h.diaSemana);
            if (dia) {
              dia.slots.push({
                id: h.id,
                horaInicio: h.horaInicio.substring(0, 5),
                horaFim: h.horaFim.substring(0, 5),
                editando: false,
                horaInicioEdit: h.horaInicio.substring(0, 5),
                horaFimEdit: h.horaFim.substring(0, 5),
              });
            }
          });
        },
        error: () => this.dialogRef.close()
      });
  }

  iniciarAdicionar(dia: DiaAtendimento) {
    dia.adicionando = true
    dia.novoInicio = '08:00'
    dia.novoFim = '12:00'
  }

  cancelarAdicionar(dia: DiaAtendimento) {
    dia.adicionando = false
  }

  confirmarAdicionar(dia: DiaAtendimento) {
    if (!this.horarioValido(dia.novoInicio, dia.novoFim)) return

    this.salvando = true;
    this.profissionaisService.adicionarHorario(this.data.profissionalId, {
      diaSemana: dia.key,
      horaInicio: dia.novoInicio + ':00',
      horaFim: dia.novoFim + ':00',
    })
    .pipe(finalize(() => this.salvando = false))
    .subscribe({
      next: (novoHorario: any) => {
        dia.slots.push({
          id: novoHorario.id,
          horaInicio: novoHorario.horaInicio.substring(0, 5),
          horaFim: novoHorario.horaFim.substring(0, 5),
          editando: false,
          horaInicioEdit: novoHorario.horaInicio.substring(0, 5),
          horaFimEdit: novoHorario.horaFim.substring(0, 5),
        });
        dia.adicionando = false;
      }
    });
  }

  iniciarEdicao(slot: Slot) {
    slot.horaInicioEdit = slot.horaInicio
    slot.horaFimEdit = slot.horaFim
    slot.editando = true
  }

  cancelarEdicao(slot: Slot) {
    slot.editando = false
  }

  confirmarEdicao(dia: DiaAtendimento, slot: Slot) {
    if (!this.horarioValido(slot.horaInicioEdit, slot.horaFimEdit) || !slot.id) return

    this.salvando = true;
    this.profissionaisService.atualizarHorario(this.data.profissionalId, slot.id, {
      diaSemana: dia.key,
      horaInicio: slot.horaInicioEdit + ':00',
      horaFim: slot.horaFimEdit + ':00',
    })
    .pipe(finalize(() => this.salvando = false))
    .subscribe({
      next: () => {
        slot.horaInicio = slot.horaInicioEdit;
        slot.horaFim = slot.horaFimEdit;
        slot.editando = false;
      }
    });
  }

  remover(dia: DiaAtendimento, slot: Slot) {
    if (!slot.id) return

    this.salvando = true;
    this.profissionaisService.removerHorario(this.data.profissionalId, slot.id)
      .pipe(finalize(() => this.salvando = false))
      .subscribe({
        next: () => {
          dia.slots = dia.slots.filter(s => s.id !== slot.id);
        }
      });
  }

  private horarioValido(inicio: string, fim: string): boolean {
    return inicio < fim
  }

  temHorarios(dia: DiaAtendimento): boolean {
    return dia.slots.length > 0
  }
}
