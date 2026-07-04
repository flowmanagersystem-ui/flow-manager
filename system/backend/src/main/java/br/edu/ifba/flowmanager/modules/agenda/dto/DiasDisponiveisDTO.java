package br.edu.ifba.flowmanager.modules.agenda.dto;

import java.time.LocalDate;
import java.util.List;

public record DiasDisponiveisDTO(
    Long profissionalId,
    String nomeProfissional,
    List<LocalDate> diasDisponiveis  // dias com pelo menos 1 slot livre no mês
) {}
