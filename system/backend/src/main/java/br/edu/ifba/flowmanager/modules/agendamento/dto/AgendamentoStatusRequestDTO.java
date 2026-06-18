package br.edu.ifba.flowmanager.modules.agendamento.dto;

import br.edu.ifba.flowmanager.modules.agendamento.StatusAgendamento;
import jakarta.validation.constraints.NotNull;

public record AgendamentoStatusRequestDTO(
    @NotNull StatusAgendamento status
) {}
