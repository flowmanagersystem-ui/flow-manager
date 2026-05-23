package br.edu.ifba.flowmanager.modules.agenda.dto;

import java.util.List;

public record DisponibilidadeDTO(
    Long profissionalId,
    String nomeProfissional,
    String diaSemana,
    List<SlotDTO> slots
) {}
