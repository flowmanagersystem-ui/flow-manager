// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// RxJS
import { first, delay, tap } from 'rxjs';

// Environment
import { environment } from '../../../environments/environment.development';

// Interfaces
import { Agendamento } from './agendamento.interface';
import { Page } from '../../shared/interfaces/page.interface';

// Services
import { AuthService } from '../../core/auth/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AgendamentosService { 
  
  private readonly API = `${environment.apiUrl}api/agendamentos`

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  listAll(page: number = 0, size: number = 10) {
    const usuario = this.authService.getUsuarioLogado()
    const clienteId = usuario?.perfil === 'CLIENTE' ? `&clienteId=${usuario.id}` : ''

    return this.http.get<Page<Agendamento>>(`${this.API}?page=${page}&size=${size}${clienteId}`)
    .pipe(
      first(),
      // Saber o que o servidor está rescebendo pelo console
      //tap(data => console.log(data))
      // Simular atraso de resposta do servidor
      // delay(15000),
    )
  }

  save(record: Agendamento){
    if(record.id){
      return this.update(record)
    }
    return this.create(record)
  }

  private create(record: Agendamento){
    return this.http.post<Agendamento>(this.API, record)
  }

  private update(record: Partial<Agendamento>){
    return this.http.patch<Agendamento>(`${this.API}/${record.id}`, record)
  }

  remove(id: number){
    return this.http.delete(`${this.API}/${id}`)
  }

  loadById(id: number){
    return this.http.get<Agendamento>(`${this.API}/${id}`)
  }

}
