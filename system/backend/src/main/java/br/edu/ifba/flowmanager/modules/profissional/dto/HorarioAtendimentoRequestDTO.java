package br.edu.ifba.flowmanager.modules.profissional.dto;

import java.time.LocalTime;

import br.edu.ifba.flowmanager.modules.profissional.horarioAtendimento.DiaSemana;
import jakarta.validation.constraints.NotNull;

public record HorarioAtendimentoRequestDTO(
    @NotNull DiaSemana diaSemana,
    @NotNull LocalTime horaInicio,
    @NotNull LocalTime horaFim
) {
   
}
