// Angular
import { Component } from '@angular/core';
import { ActivatedRoute, PRIMARY_OUTLET, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// RxJS
import { Observable, of, catchError, delay, finalize } from 'rxjs';

// Interfaces
import { Cliente } from '../../cliente.interface';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

// Services
import { ClientesService } from '../../clientes.service';
import { LoadingService } from '../../../../shared/services/loading.service';

// Components
import { ErrorDialogComponent } from '../../../../shared/components/error-dialog/error-dialog.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ClientesListComponent } from '../../components/clientes-list/clientes-list.component';
import { ClienteFormComponent } from '../cliente-form/cliente-form.component';
import { FormDialogComponent } from '../../../../shared/components/form-dialog/form-dialog.component';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    // Angular
    HttpClientModule,
    CommonModule,
    // Angular Material
    MatCardModule,
    MatProgressSpinnerModule,
    // Importes Components
    ClientesListComponent,
  ],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss'
})
export class ClientesComponent {
  clientes$: Observable<Cliente[]> | null = null

  constructor(
    private router: Router,
    private route: ActivatedRoute,    
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private clientesService: ClientesService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(){
    this.refresh()
  }

  onAdd(){
    // this.router.navigate(['novo'], { relativeTo: this.route })
    // if(this.authService.isAdmin()){
      const dialogRef = this.dialog.open(FormDialogComponent, {
        enterAnimationDuration: '400ms', 
        exitAnimationDuration: '300ms',
        data: {
          title: 'Cadastrar Cliente',
          subtitle: 'Preencha os campos abaixo para cadastrar um novo cliente.',
          component: ClienteFormComponent,
          modo: 'criar'
        }
      })  
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          console.log('Cliente criado/atualizado com sucesso!') 
          this.refresh()
        }
      })
    // }
    // else{
    //   this.onError('Você não tem permissão para editar usuários.')
    // }
  }

  onEdit(cliente: Cliente){
    // this.router.navigate(['edit', cliente.id], { relativeTo: this.route })
    // if(this.authService.isAdmin()){
      const dialogRef = this.dialog.open(FormDialogComponent, {      
        enterAnimationDuration: '400ms', 
        exitAnimationDuration: '300ms',  
        data: {
          title: 'Editar Cliente',
          subtitle: 'Preencha os campos abaixo para editar o cliente.',
          component: ClienteFormComponent,
          cliente: cliente,
          modo: 'editar'
        }
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

  onRemove(cliente: Cliente){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      enterAnimationDuration: '400ms', 
      exitAnimationDuration: '300ms',
      data: {
        msg: `Tem certeza que deseja remover o cliente "${cliente.nome} ${cliente.sobrenome}"? Esta ação não pode ser desfeita.`,
        icon: 'delete_forever',
        title: 'Confirmar Exclusão'
      }
    })

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if(result){
        this.loadingService.show()
        this.clientesService.remove(cliente.id)
        .pipe(
          finalize(() => this.loadingService.hide())
        )
        .subscribe({          
          next: () => {
            this.refresh()
            this.snackBar.open('Cliente removido com sucesso!', 'Fechar',
            {
              duration: 6000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            })
          },
          error: () => this.onError('Erro ao tentar remover cliente.')
        })
      }
    }) 
  }

  refresh() {
    this.clientes$ = this.clientesService.listAll()
    .pipe(
      catchError(error => {
        this.onError('Erro ao carregar clientes.')
        return of([])
      })
    )      
  }

  onError(errorMsg: string, redirectTo?: string) {
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      enterAnimationDuration: '400ms', 
      exitAnimationDuration: '300ms',
      data: { message: errorMsg, redirectTo }
    })

    dialogRef.afterClosed().subscribe(confirmed => {      
      this.router.navigate([''], { relativeTo: this.route }) // Mudar para rota home ou outra rota adequada
    })
  }

}
