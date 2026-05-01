import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, delay, tap, map } from 'rxjs';

import { environment } from '../../../environments/environment.development';

import { Cliente } from './cliente.interface';
import { Page } from '../../shared/interfaces/page.interface';


@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private readonly API = `${environment.apiUrl}api/clientes`

  constructor(private http: HttpClient) { }

  listAll(page: number = 0, size: number = 10) {
    return this.http.get<Page<Cliente>>(`${this.API}?page=${page}&size=${size}`)
    .pipe(
      first(),
      // Saber o que o servidor está rescebendo pelo console
      //tap(data => console.log(data))
      // Simular atraso de resposta do servidor
      // delay(15000),
    )
  }

  save(record: Cliente){
    if(record.id){
      return this.update(record)
    }
    return this.create(record)
  }

  private create(record: Cliente){
    return this.http.post<Cliente>(this.API, record)
  }

  private update(record: Partial<Cliente>){
    return this.http.patch<Cliente>(`${this.API}/${record.id}`, record)
  }

  remove(id: number){
    return this.http.delete(`${this.API}/${id}`)
  }

  loadById(id: number){
    return this.http.get<Cliente>(`${this.API}/${id}`)
  }

  validarEmailExistente(email: string, clienteId: string) {
    const params = clienteId
      ? `?email=${email}&excludeId=${clienteId}`
      : `?email=${email}`

    return this.http.get<{ existe: boolean }>(`${this.API}/verificar-email${params}`)
      .pipe(map(res => res.existe))
  }
}