// Angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { Observable, catchError, map, tap, of, finalize, distinctUntilChanged, debounceTime } from 'rxjs';

// Material
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

// Components
import { ErrorDialogComponent } from '../../../../shared/components/error-dialog/error-dialog.component';
import { ServicosListComponent } from '../../components/servicos-list/servicos-list.component';
import { ServicoFormComponent } from '../servico-form/servico-form.component';
import { LoadingService } from '../../../../shared/services/loading.service';
import { FormDialogComponent, ModoFormT } from '../../../../shared/components/form-dialog/form-dialog.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

// Interfaces
import { Servico } from '../../servico.interface';

// Services
import { ServicosService } from '../../servicos.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [
    // Angular
    HttpClientModule,
    CommonModule,    
    // Material
    MatCardModule,
    MatProgressSpinnerModule,
    // Components
    ServicosListComponent
  ],
  templateUrl: './servicos.component.html',
  styleUrl: './servicos.component.scss'
})
export class ServicosComponent {
  servicos$: Observable<Servico[]> | null = null
  totalElements = 0
  paginaAtual = 0
  totalCategorias = 0
  ticketMedio = 0
  searchControl = new FormControl('')
  nomeFiltro = ''
  categoriaFiltro = ''

  constructor(
    private servicosService: ServicosService,
    private dialog: MatDialog,
    private loadingService: LoadingService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(){
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(valor => {

      this.nomeFiltro = valor ?? '';

      this.refresh(0);

    });
    this.refresh()
  }

  onAdd(){
    // this.router.navigate(['novo'], { relativeTo: this.route })
    // if(this.authService.isAdmin()){    
    
      const dialogRef = FormDialogComponent.open<Servico>(this.dialog, {
        title: 'Novo Serviço',
        subtitle: 'Preencha os campos abaixo para cadastrar um novo serviço.',
        modo: ModoFormT.CRIAR,
        component: ServicoFormComponent,
      })
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.refresh()
        }
      })
    // }
    // else{
    //   this.onError('Você não tem permissão para editar usuários.')
    // }
  }

  onEdit(servico: Servico){
    const dialogRef = FormDialogComponent.open<Servico>(this.dialog, {
      title: 'Editar Serviço',
      subtitle: 'Preencha os campos abaixo para editar o serviço.',
      modo: ModoFormT.EDITAR,
      record: servico,
      component: ServicoFormComponent,
    })

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.refresh()
      }
    })
    // }
    // else{
    //   this.onError('Você não tem permissão para editar usuários.')
    // }
  }

  onRemove(servico: Servico){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      enterAnimationDuration: '400ms', 
      exitAnimationDuration: '300ms',
      data: {
        msg: `Tem certeza que deseja remover o Serviço "${servico.nome}"? Esta ação não pode ser desfeita.`,
        icon: 'delete_forever',
        title: 'Confirmar Exclusão'
      }
    })

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if(result){
        this.loadingService.show()
        this.servicosService.remove(servico.id)
        .pipe(
          finalize(() => this.loadingService.hide())
        )
        .subscribe({          
          next: () => {
            this.refresh()
            this.snackBar.open('Servico removido com sucesso!', 'Fechar',
            {
              duration: 6000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            })
          },
          error: () => this.onError('Erro ao tentar remover serviço.')
        })
      }
    }) 
  }

  refresh(page = 0) {    
    this.paginaAtual = page
    this.servicos$ = this.servicosService.listAll(page, 10, this.nomeFiltro, this.categoriaFiltro)
    .pipe(
      tap(response => this.totalElements = response.totalElements), 
      tap(response => {
        this.totalCategorias = new Set(
          response.content.flatMap((s: Servico) => s.categoria)
        ).size;
      }),
      tap(response => {
        const valores = response.content.map((s: Servico) => s.valor);
        this.ticketMedio = valores.length > 0 ? valores.reduce((a, b) => a + b, 0) / valores.length : 0;
      }),
      map(response => response.content),                           
      catchError(error => {
        this.onError('Erro ao carregar serviços.');
        return of([]);
      })
    )
  }

  onPageChange(event: PageEvent) {
    this.refresh(event.pageIndex)
  }

  onError(errorMsg: string, redirectTo?: string) {  
    const dialogRef = ErrorDialogComponent.open(this.dialog, { message: errorMsg, redirectTo })

    dialogRef.afterClosed().subscribe(confirmed => {      
      this.router.navigate([''], { relativeTo: this.route }) // Mudar para rota home ou outra rota adequada
    })
  }

}
