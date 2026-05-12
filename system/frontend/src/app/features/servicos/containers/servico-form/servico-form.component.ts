// Angular
import { Component, Inject } from '@angular/core';
import { CommonModule, Location  } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncValidatorFn, FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { timer, switchMap, map, catchError, of, finalize, tap } from 'rxjs';

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
import { CurrencyFormatDirective } from '../../../../shared/directives/currencyFormat.directive';
import { TimeFormatDirective } from '../../../../shared/directives/timeFormat.directive';

// Interfaces
import { Servico } from '../../servico.interface';

// Services
import { LoadingService } from '../../../../shared/services/loading.service';
import { ServicosService } from '../../servicos.service';

@Component({
  selector: 'app-servico-form',
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
    CurrencyFormatDirective,
    TimeFormatDirective,
    
  ],
  templateUrl: './servico-form.component.html',
  styleUrl: './servico-form.component.scss'
})
export class ServicoFormComponent {
  formulario!: FormGroup
  categorias: string[] = []
  servico: Servico
  title = 'Cadastro de Serviço'
  subtitle = 'Preencha os campos abaixo para cadastrar um novo serviço.'   
  hideSenha = true  
  outraCategoria = false
  status = ['Ativo', 'Inativo']

  constructor(    
    private fb: NonNullableFormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,     
    private location : Location,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<FormDialogComponent>,
    private servicosService: ServicosService,
    private loadingService: LoadingService,    
    @Inject(MAT_DIALOG_DATA) public data: { record: Servico }
  ){
    this.servico = data.record;
  }

  ngOnInit(){
    this.getCategorias()
    const getId = () => this.formulario?.get('id')?.value || ''

    this.formulario = this.fb.group({
      id: this.servico?.id || '',
      nome: [
        this.servico?.nome || '', {
          Validators: [Validators.required, Validators.minLength(3)],
          asyncValidators: [this.servicosService.validarDuplicidade('nome', getId)],
          updateOn: 'blur'
      }],
      categoria: [this.servico?.categoria || '',
        [Validators.required]
      ],
      novaCategoria: [this.servico?.categoria || '', {
        validators: [Validators.required, Validators.minLength(3)],
        // asyncValidators: [this.servicosService.validarDuplicidade('categoria', getId)],
        updateOn: 'blur'
      }],
      descricao: [
        this.servico?.descricao || '',
      ],
      duracao: [
        this.servico?.duracao || '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(5)]
      ],
      valor: [
        this.servico?.valor || '', [Validators.required, Validators.maxLength(20)]
      ],
    })    

    this.servico ? this.formulario.get('duracao')?.setValue(this.secondsToTime(this.servico?.duracao)) : null
  }  

  onCancel(){
    this.formulario.reset()
    this.location.back()
  }

  onSubmit(){             
    console.log(this.formulario)
    if(this.formulario.valid){  

      this.loadingService.show()

      const categoriaFinal = this.outraCategoria
        ? this.formulario.get('novaCategoria')?.value
        : this.formulario.get('categoria')?.value

      const payload = {
        ...this.formulario.value,
        nome: this.camelCase(this.formulario.value.nome.trim()),
        categoria: this.camelCase(categoriaFinal),
        duracao: this.timeToSeconds(this.formulario.value.duracao),
      } as Servico
      
      this.servicosService.save(payload)
      .pipe(          
        finalize(() => this.loadingService.hide())
      )
      .subscribe({
        next: () => {
          let msg = 'Serviço cadastrado\ com sucesso!'
          if(this.formulario.value.id != ''){
            msg = 'Serviço editado com sucesso!'
          }
          this.onSuccess(msg)
        },
        error: () => this.onError('Ocorreu um erro ao salvar o serviço. Por favor, tente novamente mais tarde.') 
      })
    
    }
    else{
      this.formulario.markAllAsTouched()
    }
  }

  onSelecionarCategoria() {
    this.outraCategoria = false;
    this.formulario.get('novaCategoria')?.reset();
    this.formulario.get('novaCategoria')?.clearValidators();
    this.formulario.get('novaCategoria')?.clearAsyncValidators();
    this.formulario.get('novaCategoria')?.updateValueAndValidity();
  }

  onOutraCategoria() {
    this.outraCategoria = true;
    this.formulario.get('novaCategoria')?.setValidators([Validators.required, Validators.minLength(3)]);
    this.formulario.get('novaCategoria')?.setAsyncValidators(
      this.servicosService.validarDuplicidade('categoria', () => this.formulario?.get('id')?.value)
    );
    this.formulario.get('novaCategoria')?.updateValueAndValidity();
  }

  onError(errorMsg: string, redirectTo?: string) {
    const dialogRef = ErrorDialogComponent.open(this.dialog, { message: errorMsg, redirectTo })
    
    dialogRef.afterClosed().subscribe(confirmed => {      
      this.router.navigate([''], { relativeTo: this.route })
    })
  }

  getCategorias() {    
    this.servicosService.getCategorias()
    .subscribe({
      next: categorias => this.categorias = categorias,
      error: () => this.onError('Erro ao carregar categorias.')
    })
  }

  private onSuccess(msg : string){
    this.snackBar.open(msg, '', { duration: 5000 })
    this.dialogRef.close(true); 
  }

  private camelCase(texto: string): string{
    return TextFormatted.capitalizarTexto(texto)
  }

  private timeToSeconds(value: string): number {
    const [minutes, seconds] = value.split(':').map(Number)

    return (minutes * 60) + seconds
  }

  private secondsToTime(totalSeconds: number): string {

    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
}
