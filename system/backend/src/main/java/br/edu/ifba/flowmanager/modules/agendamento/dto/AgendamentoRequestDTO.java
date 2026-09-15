package br.edu.ifba.flowmanager.modules.agendamento.dto;

import java.math.BigDecimal;
import java.util.List;

import br.edu.ifba.flowmanager.modules.agendamento.StatusAgendamento;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record AgendamentoRequestDTO(
    Long clienteId,
    @NotNull StatusAgendamento status,
    String observacao,
    BigDecimal desconto,
    @NotEmpty @Valid List<AgendamentoServicoDTO> servicos
) {}