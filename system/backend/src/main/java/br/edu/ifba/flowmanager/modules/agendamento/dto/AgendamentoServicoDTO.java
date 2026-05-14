package br.edu.ifba.flowmanager.modules.agendamento.dto;

import jakarta.validation.constraints.NotNull;

public record AgendamentoServicoDTO(
    @NotNull Long profissionalId,
    @NotNull Long servicoId
) {}
