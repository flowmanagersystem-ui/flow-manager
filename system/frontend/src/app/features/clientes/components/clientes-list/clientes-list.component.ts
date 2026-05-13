  // Angular
  import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';

  // Angular Material
  import { MatButtonModule } from '@angular/material/button';
  import { MatIconModule } from '@angular/material/icon';
  import {MatTableDataSource, MatTableModule} from '@angular/material/table';
  import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
  import { MatSort, MatSortModule } from '@angular/material/sort';

  // Interfaces
  import { Cliente } from '../../cliente.interface';

  @Component({
    selector: 'app-clientes-list',
    standalone: true,
    imports: [
      // Angular
      CommonModule,
      FormsModule,
      // Angular Material
      MatIconModule,
      MatButtonModule,
      MatTableModule,
      MatPaginatorModule,
      MatSortModule
    ],
    templateUrl: './clientes-list.component.html',
    styleUrl: './clientes-list.component.scss'
  })
  export class ClientesListComponent {
    title = 'Clientes'
    subtitle = 'Gestão de clientes cadastrados'
    info = 'cliente'
    listaVazia = 'Não há clientes cadastrados neste momento.'
    noResults = `Nenhum resultado encontrado com o filtro `
    
    dataSource: MatTableDataSource<Cliente>
    @ViewChild(MatPaginator) paginator!: MatPaginator
    @ViewChild(MatSort) sort!: MatSort
    @Input() totalElements = 0
    @Input() paginaAtual = 0
    @Input() set clientes(data: Cliente[]) { this.dataSource.data = data}
    @Output() pageChange = new EventEmitter<PageEvent>()
    @Output() add: EventEmitter<boolean> = new EventEmitter(false)
    @Output() edit: EventEmitter<Cliente> = new EventEmitter(false)
    @Output() remove: EventEmitter<Cliente> = new EventEmitter(false)

    readonly displayedColumns = ['nome', 'email', 'telefone', 'status', 'actions']
    
    constructor() {
      this.dataSource = new MatTableDataSource(this.clientes)
    }

    ngAfterViewInit() {
      this.dataSource.sort = this.sort
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

    onEdit(cliente: Cliente){
      this.edit.emit(cliente)
    }

    onRemove(cliente: Cliente){
      this.remove.emit(cliente)
    }
  }
