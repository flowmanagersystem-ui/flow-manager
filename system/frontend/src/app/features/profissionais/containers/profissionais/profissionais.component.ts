// Angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, map, tap, of, finalize } from 'rxjs';

// Material
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';

// Components
import { ProfissionaisListComponent } from '../../components/profissionais-list/profissionais-list.component';
import { ErrorDialogComponent } from '../../../../shared/components/error-dialog/error-dialog.component';
import { ProfissionalFormComponent } from '../profissional-form/profissional-form.component';
import { FormDialogComponent, ModoFormT } from '../../../../shared/components/form-dialog/form-dialog.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ProfissionalServicosDialogComponent } from '../profissional-servicos/profissional-servicos-dialog.component';
import { HorarioAtendimentoDialogComponent } from '../profissionais-horarios/horario-atendimento-dialog.component';

// Interfaces
import { Profissional, Status } from '../../profissional.interface';

// Services
import { LoadingService } from '../../../../shared/services/loading.service';
import { ProfissionaisService } from '../../profissionais.service';

@Component({
  selector: 'app-profissionais',
  standalone: true,
  imports: [    
    // Angular
    HttpClientModule,
    CommonModule,    
    // Material
    MatCardModule,
    MatProgressSpinnerModule,
    // Components
    ProfissionaisListComponent
  ],
  templateUrl: './profissionais.component.html',
  styleUrl: './profissionais.component.scss'
})
export class ProfissionaisComponent {
  profissionais$: Observable<Profissional[]> | null = null
  totalElements = 0
  paginaAtual = 0
  totalAtivos = 0
  totalEspecialidades = 0

  constructor(
    private profissionaisService: ProfissionaisService,
    private dialog: MatDialog,
    private loadingService: LoadingService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,

  ) {}

  ngOnInit(){
    this.refresh()
  }

  onAdd(){
    // this.router.navigate(['novo'], { relativeTo: this.route })
    // if(this.authService.isAdmin()){    
    
      const dialogRef = FormDialogComponent.open<Profissional>(this.dialog, {
        title: 'Novo Profissional',
        subtitle: 'Preencha os campos abaixo para cadastrar um novo profissional.',
        modo: ModoFormT.CRIAR,
        component: ProfissionalFormComponent,
      })
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          console.log('Profissional criado/atualizado com sucesso!') 
          this.refresh()
        }
      })
    // }
    // else{
    //   this.onError('Você não tem permissão para editar usuários.')
    // }
  }

  onEdit(profissional: Profissional){
    const dialogRef = FormDialogComponent.open<Profissional>(this.dialog, {
      title: 'Editar Profissional',
      subtitle: 'Preencha os campos abaixo para editar o profissional.',
      modo: ModoFormT.EDITAR,
      record: profissional,
      component: ProfissionalFormComponent,
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

  onRemove(profissional: Profissional){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      enterAnimationDuration: '400ms', 
      exitAnimationDuration: '300ms',
      data: {
        msg: `Tem certeza que deseja remover o Profissional "${profissional.nome} ${profissional.sobrenome}"? Esta ação não pode ser desfeita.`,
        icon: 'delete_forever',
        title: 'Confirmar Exclusão'
      }
    })

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if(result){
        this.loadingService.show()
        this.profissionaisService.remove(profissional.id)
        .pipe(
          finalize(() => this.loadingService.hide())
        )
        .subscribe({          
          next: () => {
            this.refresh()
            this.snackBar.open('Profissional removido com sucesso!', 'Fechar',
            {
              duration: 6000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            })
          },
          error: () => this.onError('Erro ao tentar remover profissional.')
        })
      }
    }) 
  }

  refresh(page = 0) {    
    this.paginaAtual = page
    this.profissionais$ = this.profissionaisService.listAll(page)
    .pipe(
      tap(response => this.totalElements = response.totalElements), 
      tap(response => this.totalAtivos = response.content.filter((p: Profissional) => p.status == Status.ATIVO).length),
      tap(response => this.totalEspecialidades = response.content.reduce((acc: number, p: Profissional) => acc + p.especialidades.length, 0)),
      map(response => response.content),                           
      catchError(error => {
        this.onError('Erro ao carregar profissionais.');
        return of([]);
      })
    )
  }

  onPageChange(event: PageEvent) {
    this.refresh(event.pageIndex)
  }

  onManageServices(profissional: Profissional) {
    const dialogRef = this.dialog.open(ProfissionalServicosDialogComponent, {
      width: '560px',
      maxWidth: '100vw',
      maxHeight: '90vh',
      data: {
        profissionalId: profissional.id,
        nomeProfissional: `${profissional.nome} ${profissional.sobrenome}`
      }
    })

    dialogRef.afterClosed().subscribe(alterado => {
      if (alterado) {
        this.snackBar.open('Serviços atualizados com sucesso!', '', { duration: 4000 });
      }
    })
  }

  onManageSchedules(profissional: Profissional) {
    this.dialog.open(HorarioAtendimentoDialogComponent, {
      width: '520px',
      maxWidth: '100vw',
      maxHeight: '90vh',
      data: {
        profissionalId: profissional.id,
        nomeProfissional: `${profissional.nome} ${profissional.sobrenome}`
      }
    });
  }

  onError(errorMsg: string, redirectTo?: string) {  
    const dialogRef = ErrorDialogComponent.open(this.dialog, { message: errorMsg, redirectTo })

    dialogRef.afterClosed().subscribe(confirmed => {      
      this.router.navigate([''], { relativeTo: this.route }) // Mudar para rota home ou outra rota adequada
    })
  }

}
