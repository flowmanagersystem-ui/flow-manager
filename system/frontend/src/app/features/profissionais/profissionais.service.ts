import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, delay, tap, map } from 'rxjs';

import { environment } from '../../../environments/environment.development';

import { Profissional } from './profissional.interface';
import { Page } from '../../shared/interfaces/page.interface';
import { Servico } from '../servicos/servico.interface';
import { HorarioAtendimento } from './containers/profissionais-horarios/horario-atendimento.interface';


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


  // Adições para gerenciamento de serviços vinculados a um profissional
  listarServicos(profissionalId: number) {
  return this.http.get<Servico[]>(`${this.API}/${profissionalId}/servicos`)
  .pipe(
    first(),
  );
  }

  adicionarServico(profissionalId: number, servicoId: number) {
    return this.http.post(`${this.API}/${profissionalId}/servicos/${servicoId}`, {})
    .pipe(
      first()
    );
  }

  removerServico(profissionalId: number, servicoId: number) {
    return this.http.delete(`${this.API}/${profissionalId}/servicos/${servicoId}`)
    .pipe(
      first()
    );
  }

  // Adições para gerenciamento de horários de atendimento vinculados a um profissional
  listarHorarios(profissionalId: number) {
    return this.http.get<HorarioAtendimento[]>(`${this.API}/${profissionalId}/horarios`)
      .pipe(first());
  }

  adicionarHorario(profissionalId: number, dto: HorarioAtendimento) {
    return this.http.post<HorarioAtendimento>(`${this.API}/${profissionalId}/horarios`, dto)
      .pipe(first());
  }

  atualizarHorario(profissionalId: number, horarioId: number, dto: HorarioAtendimento) {
    return this.http.put<HorarioAtendimento>(`${this.API}/${profissionalId}/horarios/${horarioId}`, dto)
      .pipe(first());
  }

  removerHorario(profissionalId: number, horarioId: number) {
    return this.http.delete(`${this.API}/${profissionalId}/horarios/${horarioId}`)
      .pipe(first());
  }
}