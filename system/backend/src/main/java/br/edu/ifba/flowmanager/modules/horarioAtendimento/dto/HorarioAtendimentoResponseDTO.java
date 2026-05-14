package br.edu.ifba.flowmanager.modules.horarioAtendimento.dto;

import java.time.LocalTime;

import br.edu.ifba.flowmanager.modules.horarioAtendimento.DiaSemana;

public record HorarioAtendimentoResponseDTO(
    Long id,
    DiaSemana diaSemana,
    LocalTime horaInicio,
    LocalTime horaFim
) {

}
