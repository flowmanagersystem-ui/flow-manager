// Angular
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

// Shared
import { TextFormatted } from '../../../../shared/text-formatted';

// Interfaces
import { Agendamento, ServicoAgendamento   } from '../../agendamento.interface';  

@Component({
  selector: 'app-agendamentos-list',
  standalone: true,
  imports: [    
    // Angular
    CommonModule,

    // Angular Material
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule, 
  ],
  templateUrl: './agendamentos-list.component.html',
  styleUrl: './agendamentos-list.component.scss'
})
export class AgendamentosListComponent {  
  title = 'Agendamentos'
  subtitle = 'Lista de Agendamentos cadastrados'
  info = 'agendamento'
  listaVazia = 'Não há agendamentos cadastrados neste momento.'
  noResults = `Nenhum resultado encontrado com o filtro `
  viewMode: boolean = false

  readonly displayedColumns = ['cliente', 'servico', 'profissional', 'dataHora', 'valor', 'status', 'actions']

  dataSource: MatTableDataSource<Agendamento>
  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort
  @Input() totalElements = 0
  @Input() paginaAtual = 0
  @Input() totalCategorias = 0
  @Input() ticketMedio = 0
  @Input() set agendamentos(data: Agendamento[]) { this.dataSource.data = data}
  @Output() pageChange = new EventEmitter<PageEvent>()
  @Output() add: EventEmitter<boolean> = new EventEmitter(false)
  @Output() edit: EventEmitter<Agendamento> = new EventEmitter(false)
  @Output() remove: EventEmitter<Agendamento> = new EventEmitter(false)

  constructor(private renderer: Renderer2) {
    this.dataSource = new MatTableDataSource(this.agendamentos)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value    
    this.dataSource.filter = filterValue.trim().toLowerCase()
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }  
  
  onAdd(){
    this.add.emit(true)
  }

  onDetails(agendamento: Agendamento){
    this.edit.emit(agendamento)
  }

  onEdit(agendamento: Agendamento){
    this.edit.emit(agendamento)
  }

  onRemove(agendamento: Agendamento){
    this.remove.emit(agendamento)
  }

  onToggleViewNode(){
    this.viewMode = !this.viewMode
  }

  profissionaisUnicos(agendamento: Agendamento): string[] {
    const unicos = new Set(agendamento.servicos.map((s: ServicoAgendamento) => s.nomeProfissional));
    return [...unicos];
  }

  servicosRestantes(agendamento: Agendamento): string {
    return agendamento.servicos
      .slice(2)
      .map((s: ServicoAgendamento) => s.nomeServico)
      .join(', ');
  }
  
  primeirosServicos(agendamento: Agendamento): ServicoAgendamento[] {
    return agendamento.servicos.slice(0, 2);
  }

  textToCurrency(value: number): string {
    return TextFormatted.textToCurrency(value)
  }

  textToDateTime(value: string): string {
    return TextFormatted.textToDateTime(value)
  }

  capitalizarTexto(texto: string): string {
    return TextFormatted.capitalizarTexto(texto)
  }
}
