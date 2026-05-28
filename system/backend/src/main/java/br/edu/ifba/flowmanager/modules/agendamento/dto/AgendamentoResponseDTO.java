package br.edu.ifba.flowmanager.modules.agendamento.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import br.edu.ifba.flowmanager.modules.agendamento.StatusAgendamento;

public record AgendamentoResponseDTO(
    Long id,
    Long clienteId,
    String nomeCliente,
    LocalDateTime dataHora,        // ← data_hora_inicio do primeiro serviço
    StatusAgendamento status,
    String observacao,
    BigDecimal desconto,
    BigDecimal valorTotal,
    List<AgendamentoServicoResponseDTO> servicos
) {}
