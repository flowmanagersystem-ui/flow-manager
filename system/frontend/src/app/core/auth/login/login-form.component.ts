// Angular
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

// Services
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    // Angular
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    // Angular Material
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {

  formulario!: FormGroup
  carregando = false
  senhaVisivel = false

  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.formulario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]]
    })
  }

  onSubmit() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched()
      return
    }

    this.carregando = true

    this.authService.login(this.formulario.getRawValue())
      .subscribe({
        next: response => {
          this.carregando = false
          this.router.navigate([this.authService.rotaInicialPorPerfil(response.perfil)])
        },
        error: () => {
          this.carregando = false
          this.snackBar.open('Email ou senha inválidos.', '', { duration: 4000 })
        }
      });
  }

  toggleSenhaVisivel() {
    this.senhaVisivel = !this.senhaVisivel
  }
}
