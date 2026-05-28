import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';

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
}