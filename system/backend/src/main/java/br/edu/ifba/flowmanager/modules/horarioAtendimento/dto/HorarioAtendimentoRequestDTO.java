package br.edu.ifba.flowmanager.modules.horarioAtendimento.dto;

import java.time.LocalTime;

import br.edu.ifba.flowmanager.modules.horarioAtendimento.DiaSemana;
import jakarta.validation.constraints.NotNull;

public record HorarioAtendimentoRequestDTO(
    @NotNull DiaSemana diaSemana,
    @NotNull LocalTime horaInicio,
    @NotNull LocalTime horaFim
) {
   
}
