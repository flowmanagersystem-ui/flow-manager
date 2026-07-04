// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// RxJS
import { first, tap } from 'rxjs';

// Environment
import { environment } from '../../../environments/environment.development';

// Interfaces
import { LoginRequest, LoginResponse, PerfilUsuario, UsuarioLogado } from './auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API = `${environment.apiUrl}api/auth`
  private readonly ACCESS_TOKEN_KEY = 'flow-manager-access-token'
  private readonly REFRESH_TOKEN_KEY = 'flow-manager-refresh-token'
  private readonly USUARIO_KEY = 'flow-manager-usuario'

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(dto: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.API}/login`, dto)
      .pipe(
        tap(response => this.salvarSessao(response))
      )
  }

  logout() {
    const token = this.getAccessToken()

    if (token) {
      this.http.post(`${this.API}/logout`, {}).subscribe()
    }

    this.limparSessao()
    this.router.navigate(['/login'])
  }

  getUsuarioLogado(): UsuarioLogado | null {
    const usuario = localStorage.getItem(this.USUARIO_KEY)

    return usuario ? JSON.parse(usuario) : null
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY)
  }

  isLogado(): boolean {
    return !!this.getAccessToken()
  }

  getPerfil(): PerfilUsuario | null {
    return this.getUsuarioLogado()?.perfil || null
  }

  rotaInicialPorPerfil(perfil: PerfilUsuario | null = this.getPerfil()): string {
    switch (perfil) {
      case 'ADMIN':
        return '/admin/agenda'
      case 'PROFISSIONAL':
        return '/profissional/agenda'
      case 'CLIENTE':
        return '/cliente/agenda'
      default:
        return '/login'
    }
  }

  cadastrar(dto: any) {
    return this.http.post<LoginResponse>(`${this.API}/cadastro`, dto)
      .pipe(
        first(),
        tap(response => this.salvarSessao(response)) 
      );
  }

  private salvarSessao(response: LoginResponse) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, response.accessToken)
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken)
    localStorage.setItem(this.USUARIO_KEY, JSON.stringify({
      id: response.id,
      nome: response.nome,
      perfil: response.perfil
    }))
  }

  private limparSessao() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY)
    localStorage.removeItem(this.REFRESH_TOKEN_KEY)
    localStorage.removeItem(this.USUARIO_KEY)
  }
}
