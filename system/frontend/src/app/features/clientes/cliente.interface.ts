export interface Cliente {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  status: StatusCliente;
  senha: string;
  tipo: TipoCliente;
}

export enum StatusCliente {
    ATIVO = 'ATIVO',
    INATIVO = 'INATIVO'
}

export enum TipoCliente {
    CLIENTE = 'CLIENTE',
}