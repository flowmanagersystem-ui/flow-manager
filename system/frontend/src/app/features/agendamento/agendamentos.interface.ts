export interface Agendamento {
  id: number;
  clienteId: number;
  dataHora: string; // ISO 8601 format
  servico: string;
  status: StatusAgendamento;
}