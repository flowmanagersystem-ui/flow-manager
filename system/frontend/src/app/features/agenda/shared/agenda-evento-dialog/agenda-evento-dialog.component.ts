// Angular 
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';

// Angular Material
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

// Shared
import { TextFormatted } from '../../../../shared/text-formatted';

// Interfaces
import { AgendaEventoExtendedProps } from '../agenda-evento.interface';
import { MatTooltipModule } from '@angular/material/tooltip';

export type AgendaEventoDialogAction = 'editar' | 'concluir' | 'cancelar';

export interface AgendaEventoDialogData {
  evento: AgendaEventoExtendedProps;
  actions?: AgendaEventoDialogAction[];
}

@Component({
  selector: 'app-agenda-evento-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatChipsModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './agenda-evento-dialog.component.html',
  styleUrl: './agenda-evento-dialog.component.scss'
})
export class AgendaEventoDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<AgendaEventoDialogComponent, AgendaEventoDialogAction | undefined>,
    @Inject(MAT_DIALOG_DATA) public data: AgendaEventoExtendedProps | AgendaEventoDialogData
  ) {}

  get evento(): AgendaEventoExtendedProps {
    return 'evento' in this.data ? this.data.evento : this.data
  }

  get actions(): AgendaEventoDialogAction[] {
    return 'evento' in this.data ? (this.data.actions || []) : ['editar', 'cancelar']
  }

  hasAction(action: AgendaEventoDialogAction): boolean {
    return this.actions.includes(action)
  }

  onAction(action: AgendaEventoDialogAction) {
    this.dialogRef.close(action)
  }

  textToDateTime(value: string): string {
    return TextFormatted.textToDateTime(value)
  }

  textToCurrency(value?: number): string {
    return TextFormatted.textToCurrency(value || 0)
  }

  capitalizarTexto(texto: string): string {
    return TextFormatted.capitalizarTexto(texto)
  }
}
