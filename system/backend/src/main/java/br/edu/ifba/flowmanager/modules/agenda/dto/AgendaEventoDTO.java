package br.edu.ifba.flowmanager.modules.agenda.dto;

import java.time.LocalDateTime;

public record AgendaEventoDTO(
    String id,
    String title,
    LocalDateTime start,
    LocalDateTime end,
    String color,
    AgendaEventoExtendedPropsDTO extendedProps
) {}
