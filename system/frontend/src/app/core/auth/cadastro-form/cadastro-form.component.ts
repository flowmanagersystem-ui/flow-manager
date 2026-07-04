// Angular
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// RxJS
import { finalize } from 'rxjs/internal/operators/finalize';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

// Services
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-cadastro-form',
  standalone: true,
  imports: [
    // Angular
    CommonModule, 
    ReactiveFormsModule,
    RouterModule,
    // Material
    MatFormFieldModule, 
    MatInputModule,
    MatButtonModule, 
    MatIconModule, 
  ],
  templateUrl: './cadastro-form.component.html',
  styleUrl: './cadastro-form.component.scss'
})
export class CadastroFormComponent implements OnInit {

  formulario!: FormGroup;
  carregando = false;
  senhaVisivel = false;

  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.formulario = this.fb.group({
      nome:      ['', [Validators.required, Validators.minLength(3)]],
      sobrenome: ['', [Validators.required, Validators.minLength(3)]],
      email:     ['', [Validators.required, Validators.email]],
      telefone:  ['', [Validators.required]],
      senha:     ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  toggleSenhaVisivel() {
    this.senhaVisivel = !this.senhaVisivel;
  }

  onSubmit() {
    if (this.formulario.invalid) return;

    this.carregando = true;
    this.authService.cadastrar(this.formulario.value)
      .pipe(finalize(() => this.carregando = false))
      .subscribe({
        next: () => this.router.navigate(['/cliente/agenda']),
        error: (err) => {
          if (err.status === 409) {
            this.formulario.get('email')!.setErrors({ emailJaCadastrado: true });
          }
        }
      });
  }
}