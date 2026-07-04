package br.edu.ifba.flowmanager.modules.agenda.dto;

import java.time.LocalTime;

public record SlotDTO(
    LocalTime horario,
    boolean disponivel
) {}
