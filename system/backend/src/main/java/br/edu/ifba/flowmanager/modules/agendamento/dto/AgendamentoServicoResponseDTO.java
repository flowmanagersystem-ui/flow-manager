package br.edu.ifba.flowmanager.modules.agendamento.dto;

import java.math.BigDecimal;

public record AgendamentoServicoResponseDTO(
    Long profissionalId,
    String nomeProfissional,
    Long servicoId,
    String nomeServico,
    BigDecimal valorServico,
    Integer duracao
) {
    
}
