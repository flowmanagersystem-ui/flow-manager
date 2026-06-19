package br.edu.ifba.flowmanager.modules.agenda.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import br.edu.ifba.flowmanager.modules.agendamento.StatusAgendamento;
import br.edu.ifba.flowmanager.modules.agendamento.dto.AgendamentoServicoResponseDTO;

public record AgendaEventoExtendedPropsDTO(
    Long agendamentoId,
    Long clienteId,
    String nomeCliente,
    LocalDateTime dataHoraInicio,
    LocalDateTime dataHoraFim,
    StatusAgendamento status,
    String observacao,
    BigDecimal desconto,
    BigDecimal valorTotal,
    List<AgendamentoServicoResponseDTO> servicos
) {}
