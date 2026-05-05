export interface Profissional {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  status: Status;
  especialidades: Especialidade[];
  senha: string;
  tipo: Tipo;
}

export interface Especialidade {
  id: number;
  nome: string;
}

export enum Status {
  ATIVO = 'Ativo',
  INATIVO = 'Inativo',
}

export enum Tipo {
  PROFISSIONAL = 'Profissional',
}