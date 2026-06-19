import { Status } from '../../agendamentos/agendamento.interface';

export interface AgendaEventoServico {
  profissionalId: number
  nomeProfissional: string
  servicoId: number
  nomeServico: string
  valorServico: number
  duracao: number
  dataHoraInicio: string
  dataHoraFim: string
}

export interface AgendaEventoExtendedProps {
  agendamentoId: number
  clienteId: number
  nomeCliente: string
  dataHoraInicio: string
  dataHoraFim: string
  status: Status
  observacao?: string
  desconto?: number
  valorTotal: number
  servicos: AgendaEventoServico[]
}

export interface AgendaEvento {
  id: string
  title: string
  start: string
  end: string
  color: string
  extendedProps: AgendaEventoExtendedProps
}

export interface AgendaEventosFiltro {
  dataInicio: Date
  dataFim: Date
  profissionalId?: number | null
  status?: Status | null
}
