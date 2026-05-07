import { Component, EventEmitter, Input, Output, ViewChild, Renderer2 } from '@angular/core';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Servico } from '../../servico.interface';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-servicos-list',
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
    MatSortModule
  ],
  templateUrl: './servicos-list.component.html',
  styleUrl: './servicos-list.component.scss'
})
export class ServicosListComponent {
  title = 'Serviços'
  subtitle = 'Lista de Serviços cadastrados'
  info = 'serviço'
  listaVazia = 'Não há serviços cadastrados neste momento.'
  noResults = `Nenhum resultado encontrado com o filtro `
  viewMode: boolean = false

  selectedAZ = 'nome'
  selectedEspecialidade = 'todas'
  selectedStatus = 'todos'

  readonly displayedColumns = ['nome', 'categoria', 'descricao', 'duracao', 'valor', 'actions']

  dataSource: MatTableDataSource<Servico>
  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort
  @Input() totalElements = 0
  @Input() paginaAtual = 0
  @Input() totalCategorias = 0
  @Input() ticketMedio = 0
  @Input() set servicos(data: Servico[]) { this.dataSource.data = data}
  @Output() pageChange = new EventEmitter<PageEvent>()
  @Output() add: EventEmitter<boolean> = new EventEmitter(false)
  @Output() edit: EventEmitter<Servico> = new EventEmitter(false)
  @Output() remove: EventEmitter<Servico> = new EventEmitter(false)

  constructor(private renderer: Renderer2) {
    this.dataSource = new MatTableDataSource(this.servicos)
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

  onDetails(servico: Servico){
    this.edit.emit(servico)
  }

  onEdit(servico: Servico){
    this.edit.emit(servico)
  }

  onRemove(servico: Servico){
    this.remove.emit(servico)
  }

  onToggleViewNode(){
    this.viewMode = !this.viewMode
  }

  secondsToTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  textToCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

}
