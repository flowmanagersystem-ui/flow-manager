import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, delay, tap, map } from 'rxjs';

import { environment } from '../../../environments/environment.development';

import { Profissional } from './profissional.interface';
import { Page } from '../../shared/interfaces/page.interface';


@Injectable({
  providedIn: 'root'
})
export class ProfissionaisService {

  private readonly API = `${environment.apiUrl}api/profissionais`

  constructor(private http: HttpClient) { }

  listAll(page: number = 0, size: number = 10) {
    return this.http.get<Page<Profissional>>(`${this.API}?page=${page}&size=${size}`)
    .pipe(
      first(),
      // Saber o que o servidor está rescebendo pelo console
      // tap(data => console.log(data))
      // Simular atraso de resposta do servidor
      // delay(15000),
    )
  }

  save(record: Profissional){
    if(record.id){
      return this.update(record)
    }
    return this.create(record)
  }

  private create(record: Profissional){
    return this.http.post<Profissional>(this.API, record)
  }

  private update(record: Partial<Profissional>){
    return this.http.patch<Profissional>(`${this.API}/${record.id}`, record)
  }

  remove(id: number){
    return this.http.delete(`${this.API}/${id}`)
  }

  loadById(id: number){
    return this.http.get<Profissional>(`${this.API}/${id}`)
  }

  validarEmailExistente(email: string, clienteId: string) {
    const params = clienteId
      ? `?email=${email}&excludeId=${clienteId}`
      : `?email=${email}`

    return this.http.get<{ existe: boolean }>(`${this.API}/verificar-email${params}`)
      .pipe(map(res => res.existe))
  }
}