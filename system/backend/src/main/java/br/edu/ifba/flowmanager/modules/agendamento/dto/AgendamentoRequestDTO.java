package br.edu.ifba.flowmanager.modules.agendamento.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import br.edu.ifba.flowmanager.modules.agendamento.StatusAgendamento;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record AgendamentoRequestDTO(
    @NotNull Long clienteId,
    @NotNull LocalDateTime dataHora,
    @NotNull StatusAgendamento status,
    String observacao,
    BigDecimal desconto,
    @NotEmpty List<AgendamentoServicoDTO> servicos
) {
}
