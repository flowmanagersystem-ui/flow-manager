package br.edu.ifba.flowmanager.modules.agenda.dto;

import java.time.LocalDate;
import java.util.List;

public record DisponibilidadeDTO(
    Long profissionalId,
    String nomeProfissional,
    LocalDate data,
    List<SlotDTO> slots
) {}
