package br.edu.ifba.flowmanager.modules.agendamento.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;

public record AgendamentoServicoDTO(
    @NotNull Long profissionalId,
    @NotNull Long servicoId,
    @NotNull LocalDateTime dataHoraInicio  // ← data e hora real do serviço
) {}