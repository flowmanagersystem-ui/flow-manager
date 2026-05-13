package br.edu.ifba.flowmanager.modules.servico.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ServicoRequestDTO(
    Long id,
    @NotBlank String nome,
    String descricao,
    @NotBlank String categoria,
    @NotNull @Min(1) Integer duracao,
    @NotNull @DecimalMin("0.01") BigDecimal valor
) {}
