export interface Agendamento {
  id?: number;
  clienteId: number;        
  nomeCliente?: string;
  dataHora?: string;         
  status: Status;           
  observacao: string;      
  desconto: number;
  valorTotal?: number;       
  servicos: ServicoAgendamento[];  
}

export interface ServicoAgendamento {
  profissionalId: number;
  nomeProfissional?: string;
  servicoId: number;
  nomeServico?: string;      
  valorServico?: number;     
  duracao?: number;          
  dataHoraInicio?: string;
  dataHoraFim?: string;
  horario?: string;
}

export enum Status {
  AGENDADO   = 'AGENDADO',
  CANCELADO  = 'CANCELADO',
  CONCLUIDO  = 'CONCLUIDO',
  REAGENDADO = 'REAGENDADO'
}
