// Angular
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// RxJS
import { of, Observable, tap, map, catchError, finalize } from 'rxjs';

// Angular Material
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';

// Components
import { AgendamentosListComponent } from '../../components/agendamentos-list/agendamentos-list.component';
import { ErrorDialogComponent } from '../../../../../shared/components/error-dialog/error-dialog.component';
import { FormDialogComponent, ModoFormT } from '../../../../../shared/components/form-dialog/form-dialog.component';
import { AgendamentoFormComponent } from '../agendamento-form/agendamento-form.component';
import { AgendamentoEdicaoComponent } from '../agendamento-edicao/agendamento-edicao.component';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

// Interfaces
import { Agendamento } from '../../../agendamento.interface';

// Services
import { LoadingService } from '../../../../../shared/services/loading.service';
import { AgendamentosService } from '../../../agendamentos.service';

@Component({
  selector: 'app-agendamentos',
  standalone: true,
  imports: [    
    // Angular
    HttpClientModule,
    CommonModule,
    // Angular Material
    MatCardModule,
    MatProgressSpinnerModule,
    // Importes Components
    AgendamentosListComponent,
  ],
  templateUrl: './agendamentos.component.html',
  styleUrl: './agendamentos.component.scss'
})
export class AgendamentosComponent implements OnInit {
  agendamentos$: Observable<Agendamento[]> | null = null
  totalElements = 0
  paginaAtual = 0
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,    
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private agendamentosService: AgendamentosService,
    private loadingService: LoadingService,
  ) {}

  
  ngOnInit(){
    this.refresh()
  }

  onAdd(){
    // this.router.navigate(['novo'], { relativeTo: this.route })
    // if(this.authService.isAdmin()){    
    
      const dialogRef = FormDialogComponent.open<Agendamento>(this.dialog, {
        title: 'Novo Agendamento',
        subtitle: 'Preencha os campos abaixo para cadastrar um novo agendamento.',
        modo: ModoFormT.CRIAR,
        component: AgendamentoFormComponent,
      })
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          console.log('Agendamento criado/atualizado com sucesso!') 
          this.refresh()
        }
      })
    // }
    // else{
    //   this.onError('Você não tem permissão para editar usuários.')
    // }
  }
  
  onEdit(agendamento: Agendamento){
    const dialogRef = FormDialogComponent.open<Agendamento>(this.dialog, {
      title: 'Editar Agendamento',
      subtitle: 'Edite status, observação, desconto e os serviços do agendamento.',
      modo: ModoFormT.EDITAR,
      record: agendamento,
      component: AgendamentoEdicaoComponent,
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

  onRemove(agendamento: Agendamento){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      enterAnimationDuration: '400ms', 
      exitAnimationDuration: '300ms',
      data: {
        msg: `Tem certeza que deseja remover o agendamento de "${agendamento.nomeCliente}"? Esta ação não pode ser desfeita.`,
        icon: 'delete_forever',
        title: 'Confirmar Exclusão'
      }
    })

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if(result){
        this.loadingService.show()
        this.agendamentosService.remove(agendamento.id!)
        .pipe(
          finalize(() => this.loadingService.hide())
        )
        .subscribe({          
          next: () => {
            this.refresh()
            this.snackBar.open('Agendamento removido com sucesso!', 'Fechar',
            {
              duration: 6000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            })
          },
          error: () => this.onError('Erro ao tentar remover agendamento.')
        })
      }
    }) 
  }

  refresh(page = 0) {
    this.paginaAtual = page
    this.agendamentos$ = this.agendamentosService.listAll(page)
    .pipe(
      tap(response => this.totalElements = response.totalElements), 
      map(response => response.content),                           
      // tap(console.log), // Verificar resposta do servidor
      catchError(error => {
        this.onError('Erro ao carregar agendamentos.');
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
