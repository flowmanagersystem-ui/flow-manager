package br.edu.ifba.flowmanager.modules.servico.dto;

import java.math.BigDecimal;

public record ServicoResponseDTO(
    Long id,
    String nome,
    String descricao,
    String categoria,
    Integer duracao,
    BigDecimal valor
) {}
