import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, delay, tap, map } from 'rxjs';

import { environment } from '../../../environments/environment.development';

import { Servico } from './servico.interface';
import { Page } from '../../shared/interfaces/page.interface';
import { AsyncValidatorFn } from '@angular/forms';
import { validarDuplicidade } from '../../shared/validators/duplicidade.validator';

@Injectable({
  providedIn: 'root'
})
export class ServicosService {

  private readonly API = `${environment.apiUrl}api/servicos`

  constructor(private http: HttpClient) { }

  listAll(page: number = 0, size: number = 10) {
    return this.http.get<Page<Servico>>(`${this.API}?page=${page}&size=${size}`)
    .pipe(
      first(),
      // Saber o que o servidor está rescebendo pelo console
      // tap(data => console.log(data))
      // Simular atraso de resposta do servidor
      // delay(15000),
    )
  }

  save(record: Servico){
    if(record.id){
      return this.update(record)
    }
    return this.create(record)
  }

  private create(record: Servico){
    return this.http.post<Servico>(this.API, record)
  }

  private update(record: Partial<Servico>){
    return this.http.patch<Servico>(`${this.API}/${record.id}`, record)
  }

  remove(id: number){
    return this.http.delete(`${this.API}/${id}`)
  }

  loadById(id: number){
    return this.http.get<Servico>(`${this.API}/${id}`)
  }

  getCategorias() {
    return this.http.get<string[]>(`${this.API}/categorias`)
      .pipe(first())
  }

  validarDuplicidade(campo: string, getId: () => any): AsyncValidatorFn {
    return validarDuplicidade(this.http, this.API, campo, getId);
  }
}