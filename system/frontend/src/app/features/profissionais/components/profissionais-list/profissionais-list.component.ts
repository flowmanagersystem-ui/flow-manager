import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

// Interfaces
import { Profissional } from '../../profissional.interface';

@Component({
  selector: 'app-profissionais-list',
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
  templateUrl: './profissionais-list.component.html',
  styleUrl: './profissionais-list.component.scss'
})
export class ProfissionaisListComponent {
  title = 'Profissionais'
  subtitle = 'Lista de Profissionais cadastrados'
  info = 'profissional'
  listaVazia = 'Não há profissionais cadastrados neste momento.'
  noResults = `Nenhum resultado encontrado com o filtro `
  viewMode: boolean = false

  selectedAZ = 'nome'
  selectedEspecialidade = 'todas'
  selectedStatus = 'todos'
  mediaServicos = 3

  readonly displayedColumns = ['nome', 'email', 'telefone', 'status', 'actions']

  dataSource: MatTableDataSource<Profissional>
  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort
  @Input() totalElements = 0
  @Input() paginaAtual = 0
  @Input() totalAtivos = 0
  @Input() totalEspecialidades = 0
  @Input() set profissionais(data: Profissional[]) { this.dataSource.data = data}
  @Output() pageChange = new EventEmitter<PageEvent>()
  @Output() add: EventEmitter<boolean> = new EventEmitter(false)
  @Output() edit: EventEmitter<Profissional> = new EventEmitter(false)
  @Output() remove: EventEmitter<Profissional> = new EventEmitter(false)

  // Para os cards
  // profissionais: Profissional[] = []
  // @Input() set profissionaisInput(data: Profissional[]) {
  //   this.profissionais = data;
  // }

  constructor(private renderer: Renderer2) {
    this.dataSource = new MatTableDataSource(this.profissionais)
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

  onDetails(profissional: Profissional){
    this.edit.emit(profissional)
  }

  onEdit(profissional: Profissional){
    this.edit.emit(profissional)
  }

  onRemove(profissional: Profissional){
    this.remove.emit(profissional)
  }

  onToggleViewNode(){
    this.viewMode = !this.viewMode
  }
}
