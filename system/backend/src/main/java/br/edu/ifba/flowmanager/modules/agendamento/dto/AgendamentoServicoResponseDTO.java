package br.edu.ifba.flowmanager.modules.agendamento.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AgendamentoServicoResponseDTO(
    Long profissionalId,
    String nomeProfissional,
    Long servicoId,
    String nomeServico,
    BigDecimal valorServico,
    Integer duracao,
    LocalDateTime dataHoraInicio,  // ← incluso na resposta
    LocalDateTime dataHoraFim      // ← incluso na resposta
) {}