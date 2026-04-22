// Angular
import { CommonModule, Location  } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// RxJS
import { catchError, delay, finalize, map, of, switchMap, tap, timer } from 'rxjs';

// Angular Material
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

// Interfaces
import { Cliente } from '../../cliente.interface';

// Diretivas
import { TelFormatDirective } from '../../../../shared/directives/telFormat.directive';

// Validations
import { FormValidations } from '../../../../shared/forms-validations';
import { TextFormatted } from '../../../../shared/text-formatted';

// Components
import { InputErroMsgComponent } from '../../../../shared/components/input-erro-msg/input-erro-msg.component';
import { ErrorDialogComponent } from '../../../../shared/components/error-dialog/error-dialog.component';
import { FormDialogComponent } from '../../../../shared/components/form-dialog/form-dialog.component';

// Services
import { ClientesService } from '../../clientes.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // Angular Material
    MatCardModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule,
    MatSnackBarModule,
    MatIconModule,    
    // Components
    InputErroMsgComponent,
    // Diretivas
    TelFormatDirective,

  ],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.scss'
})
export class ClienteFormComponent {
  formulario!: FormGroup
  title = 'Cadastro de Cliente'
  subtitle = 'Preencha os campos abaixo para cadastrar um novo cliente.'   
  hideSenha = true
  status = ['Ativo', 'Inativo']

  constructor(
    private fb: NonNullableFormBuilder,
    private location : Location,
    private router: Router,
    private route: ActivatedRoute,    
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private clientesService: ClientesService,
    private loadingService: LoadingService,    
    private dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { cliente: Cliente, modo: 'criar' | 'editar' }
  ) { }

  ngOnInit(){
    this.formulario = this.fb.group({
      id: this.data.cliente?.id || '',
      nome: [this.data.cliente?.nome || '', [Validators.required, Validators.minLength(3)]],
      sobrenome: [this.data.cliente?.sobrenome || '', [Validators.required, Validators.minLength(3)]],
      email: [this.data.cliente?.email || '', [Validators.required, Validators.email], this.validarEmailDuplicado.bind(this)],
      telefone: [this.data.cliente?.telefone || '', [Validators.required, FormValidations.telMinLength, FormValidations.telMaxLength]],
      senha: [this.data.cliente?.senha || '', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      status: [this.data.cliente?.status || '', [Validators.required]],
    })    
  }  

  onSubmit(){
    if(this.formulario.valid){           
      this.loadingService.show()
      this.clientesService.save(this.formulario.value as Cliente)
      .pipe(          
        finalize(() => this.loadingService.hide())
      )
      .subscribe({
        next: () => {
          let msg = 'Cliente cadastrado\ com sucesso!'
          if(this.formulario.value.id != ''){
            msg = 'Cliente editado com sucesso!'
          }
          this.onSuccess(msg)
        },
        error: () => this.onError('Ocorreu um erro ao salvar o cliente. Por favor, tente novamente mais tarde.') 
      })
    
    }
    else{
      this.formulario.markAllAsTouched()
    }
  }
  
  onCancel(){
    this.formulario.reset()
    this.location.back()
  }

  private onSuccess(msg : string){
    this.snackBar.open(msg, '', { duration: 5000 })
    this.dialogRef.close(true); 
  }

  onError(errorMsg: string, redirectTo?: string) {
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      data: { message: errorMsg, redirectTo }
    })

    dialogRef.afterClosed().subscribe(confirmed => {      
      this.router.navigate([''], { relativeTo: this.route })
    })
  }

  private validarEmailDuplicado(formControl: FormControl) {
    const idCliente = formControl.parent?.get('id')?.value
    const email = formControl.value

    return timer(500).pipe(
      switchMap(() => this.clientesService.validarEmailExistente(email, idCliente)),
      map(emailExiste => emailExiste ? { emailJaCadastrado: true } : null),
      catchError(() => {
        this.onError('Ocorreu um erro ao verificar o email. Servidor indisponível. Por favor, tente novamente mais tarde.');
        return of(null)
      })
    )    
  }

  private formatarTelefone(telefone: string): string{
    return TextFormatted.telFormat(telefone)
  }
}
