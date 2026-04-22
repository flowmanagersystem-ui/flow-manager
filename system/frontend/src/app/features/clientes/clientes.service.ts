import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, delay, tap, map } from 'rxjs';

import { environment } from '../../../environments/environment.development';

import { Cliente } from './cliente.interface';


@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private readonly API = `${environment.apiUrl}api/clientes`
  //npx json-server --host 0.0.0.0 --watch db/db.json --port 8080 --routes db/routes.json

  constructor(private http: HttpClient) { }

  listAll(){
    return this.http.get<Cliente[]>(this.API)
    .pipe(
      first(),
      // Saber o que o servidor está rescebendo pelo console
      // tap(data => console.log(data))
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

  validarEmailExistente(email: string, clienteId: string){
    return this.http.get(this.API)
    .pipe(
      map((clientes: any) => {
        return clientes.map((cliente: Cliente) => ({ id: cliente.id, email: cliente.email }))
      }),
      // tap(console.log),
      map((clientes: any[]) => {
        // Verifica se o email está cadastrado, excluindo o usuário com o ID especificado
        return clientes.some((cliente: Cliente) => cliente.email === email && String(cliente.id) !== String(clienteId))
      }),
      // tap(console.log)
    )
  }
}