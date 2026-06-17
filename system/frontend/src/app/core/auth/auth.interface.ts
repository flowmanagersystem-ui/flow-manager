export type PerfilUsuario = 'CLIENTE' | 'PROFISSIONAL' | 'ADMIN'

export interface LoginRequest {
  email: string
  senha: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  perfil: PerfilUsuario
  nome: string
  id: number
}

export interface UsuarioLogado {
  id: number
  nome: string
  sobrenome?: string
  email?: string
  perfil: PerfilUsuario
}
