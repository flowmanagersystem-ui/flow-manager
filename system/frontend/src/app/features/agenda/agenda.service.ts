// Angular
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

// RXJS
import { first, tap } from 'rxjs/operators';

// App
import { environment } from '../../../environments/environment.development';

// Interfaces
import { Status } from '../agendamentos/agendamento.interface';
import { AgendaEvento, AgendaEventosFiltro } from './shared/agenda-evento.interface';

export interface SlotDTO {
  horario: string;
  disponivel: boolean;
}

export interface DisponibilidadeDTO {
  profissionalId: number;
  nomeProfissional: string;
  data: string;
  slots: SlotDTO[];
}

export interface DiasDisponiveisDTO {
  profissionalId: number;
  nomeProfissional: string;
  diasDisponiveis: string[];
}

@Injectable({ providedIn: 'root' })
export class AgendaService {

  private readonly API = `${environment.apiUrl}api/agenda`;

  constructor(private http: HttpClient) {}

  getDiasDisponiveis(profissionalId: number, servicoId: number, ano: number, mes: number) {
    const params = new HttpParams()
      .set('profissionalId', profissionalId)
      .set('servicoId', servicoId)
      .set('ano', ano)
      .set('mes', mes);

    return this.http.get<DiasDisponiveisDTO>(`${this.API}/dias-disponiveis`, { params })
      .pipe(first());
  }

  getDisponibilidade(profissionalId: number, servicoId: number, data: string) {
    const params = new HttpParams()
      .set('profissionalId', profissionalId)
      .set('servicoId', servicoId)
      .set('data', data);

    return this.http.get<DisponibilidadeDTO>(`${this.API}/disponibilidade`, { params })
      .pipe(first());
  }

  getEventos(filtro: AgendaEventosFiltro) {
    let params = new HttpParams()
      .set('dataInicio', this.toLocalDateTimeParam(filtro.dataInicio))
      .set('dataFim', this.toLocalDateTimeParam(filtro.dataFim));

    if (filtro.profissionalId) {
      params = params.set('profissionalId', filtro.profissionalId);
    }

    if (filtro.status) {
      params = params.set('status', filtro.status);
    }

    return this.http.get<AgendaEvento[]>(`${this.API}/eventos`, { params })
      .pipe(first());
  }

  private toLocalDateTimeParam(date: Date): string {
    const pad = (value: number) => value.toString().padStart(2, '0');

    return [
      date.getFullYear(),
      pad(date.getMonth() + 1),
      pad(date.getDate())
    ].join('-') + 'T' + [
      pad(date.getHours()),
      pad(date.getMinutes()),
      pad(date.getSeconds())
    ].join(':');
  }
}
