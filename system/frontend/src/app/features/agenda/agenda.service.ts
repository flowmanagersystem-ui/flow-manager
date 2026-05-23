import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';

export interface SlotDTO {
  horario: string
  disponivel: boolean
  agendamentoId: number | null
}

export interface DisponibilidadeDTO {
  profissionalId: number
  nomeProfissional: string
  diaSemana: string
  slots: SlotDTO[]
}

@Injectable({ providedIn: 'root' })
export class AgendaService {

  private readonly API = `${environment.apiUrl}api/agenda`;

  constructor(private http: HttpClient) {}
 
  getDisponibilidade(profissionalId: number, diaSemana: string, servicoId: number) {
    return this.http.get<DisponibilidadeDTO>(
      `${this.API}/disponibilidade?profissionalId=${profissionalId}&diaSemana=${diaSemana}&servicoId=${servicoId}`
    ).pipe(first());
  }

  getProfissionaisDisponiveis(servicoId: number, diaSemana: string) {
    return this.http.get<DisponibilidadeDTO[]>(
      `${this.API}/profissionais-disponiveis?servicoId=${servicoId}&diaSemana=${diaSemana}`
    ).pipe(first());
  }
}