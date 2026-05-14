// Angular
import { Component, Inject } from '@angular/core';
import { CommonModule, Location  } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { timer, switchMap, map, catchError, of, finalize } from 'rxjs';

// Material
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

// Components
import { ErrorDialogComponent } from '../../../../shared/components/error-dialog/error-dialog.component';
import { InputErroMsgComponent } from '../../../../shared/components/input-erro-msg/input-erro-msg.component';
import { FormDialogComponent } from '../../../../shared/components/form-dialog/form-dialog.component';

// Validations
import { FormValidations } from '../../../../shared/forms-validations';
import { TextFormatted } from '../../../../shared/text-formatted';

// Diretivas
import { TelFormatDirective } from '../../../../shared/directives/telFormat.directive';

// Interfaces
import { Profissional } from '../../profissional.interface';

// Services
import { ProfissionaisService } from '../../profissionais.service';
import { LoadingService } from '../../../../shared/services/loading.service';


@Component({
  selector: 'app-profissional-form',
  standalone: true,
  imports: [    
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // Material
    MatCardModule, 
    MatFormFieldModule,
    MatInputModule,    
    MatSelectModule,   
    MatIconModule,   
    // Components
    InputErroMsgComponent,
    // Diretivas
    TelFormatDirective,
  ],
  templateUrl: './profissional-form.component.html',
  styleUrl: './profissional-form.component.scss'
})
export class ProfissionalFormComponent {
  formulario!: FormGroup
  profissional: Profissional
  title = 'Cadastro de Profissional'
  subtitle = 'Preencha os campos abaixo para cadastrar um novo profissional.'   
  hideSenha = true  
  status = ['Ativo', 'Inativo']
  // status: Status = Status.ATIVO | Status.INATIVO

  constructor(    
    private fb: NonNullableFormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,     
    private location : Location,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<FormDialogComponent>,
    private profissionaisService: ProfissionaisService,
    private loadingService: LoadingService,    
    @Inject(MAT_DIALOG_DATA) public data: { record: Profissional }
  ){
    this.profissional = data.record;
  }

  ngOnInit(){
    this.formulario = this.fb.group({
      id: this.profissional?.id || '',
      nome: [this.profissional?.nome || '', [Validators.required, Validators.minLength(3)]],
      sobrenome: [this.profissional?.sobrenome || '', [Validators.required, Validators.minLength(3)]],
      email: [this.profissional?.email || '', [Validators.required, Validators.email], this.validarEmailDuplicado.bind(this)],
      telefone: [this.profissional?.telefone || '', [Validators.required, FormValidations.telMinLength, FormValidations.telMaxLength]],
      senha: ['', [Validators.minLength(6), Validators.maxLength(20), FormValidations.validarCaracterEspaco]],
      status: [this.profissional?.status || '', [Validators.required]],
    })    
  }  

  onCancel(){
    this.formulario.reset()
    this.location.back()
  }

  onSubmit(){
    if(this.formulario.valid){           
      this.loadingService.show()
      const payload = {
        ...this.formulario.value,
        nome: this.camelCase(this.formulario.value.nome.trim()),
        sobrenome: this.camelCase(this.formulario.value.sobrenome.trim()),
        email: this.formulario.value.email.toLowerCase().trim(),
      } as Profissional
      
      this.profissionaisService.save(payload)
      .pipe(          
        finalize(() => this.loadingService.hide())
      )
      .subscribe({
        next: () => {
          let msg = 'Profissional cadastrado\ com sucesso!'
          if(this.formulario.value.id != ''){
            msg = 'Profissional editado com sucesso!'
          }
          this.onSuccess(msg)
        },
        error: () => this.onError('Ocorreu um erro ao salvar o profissional. Por favor, tente novamente mais tarde.') 
      })
    
    }
    else{
      this.formulario.markAllAsTouched()
    }
  }

  onError(errorMsg: string, redirectTo?: string) {
    const dialogRef = ErrorDialogComponent.open(this.dialog, { message: errorMsg, redirectTo })
    
    dialogRef.afterClosed().subscribe(confirmed => {      
      this.router.navigate([''], { relativeTo: this.route })
    })
  }

  private validarEmailDuplicado(formControl: FormControl) {
    const idCliente = formControl.parent?.get('id')?.value
    const email = formControl.value

    return timer(500).pipe(
      switchMap(() => this.profissionaisService.validarEmailExistente(email, idCliente)),
      map(emailExiste => emailExiste ? { emailJaCadastrado: true } : null),
      catchError(() => {
        this.onError('Ocorreu um erro ao verificar o email. Servidor indisponível. Por favor, tente novamente mais tarde.');
        return of(null)
      })
    )    
  }

  private onSuccess(msg : string){
    this.snackBar.open(msg, '', { duration: 5000 })
    this.dialogRef.close(true); 
  }

  private camelCase(texto: string): string{
    return TextFormatted.capitalizarTexto(texto)
  }

}
