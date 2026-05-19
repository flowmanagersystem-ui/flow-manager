package br.edu.ifba.flowmanager.modules.profissional.dto;

import java.time.LocalTime;

import br.edu.ifba.flowmanager.modules.profissional.horarioAtendimento.DiaSemana;

public record HorarioAtendimentoResponseDTO(
    Long id,
    DiaSemana diaSemana,
    LocalTime horaInicio,
    LocalTime horaFim
) {

}
