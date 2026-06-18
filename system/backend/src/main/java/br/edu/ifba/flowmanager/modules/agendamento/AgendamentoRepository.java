package br.edu.ifba.flowmanager.modules.agendamento;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    // ── listagem com filtros ──────────────────────────────────

    @Query(
        value = """
            SELECT DISTINCT a FROM Agendamento a
            JOIN FETCH a.cliente c
            JOIN FETCH c.usuario
            LEFT JOIN FETCH a.servicos s
            WHERE (:clienteId IS NULL OR c.id = :clienteId)
            AND (:profissionalId IS NULL OR s.profissional.id = :profissionalId)
            AND (:status IS NULL OR a.status = :status)
            AND (:dataInicio IS NULL OR a.dataHora >= :dataInicio)
            AND (:dataFim IS NULL OR a.dataHora <= :dataFim)
        """,
        countQuery = """
            SELECT COUNT(DISTINCT a) FROM Agendamento a
            JOIN a.cliente c
            LEFT JOIN a.servicos s
            WHERE (:clienteId IS NULL OR c.id = :clienteId)
            AND (:profissionalId IS NULL OR s.profissional.id = :profissionalId)
            AND (:status IS NULL OR a.status = :status)
            AND (:dataInicio IS NULL OR a.dataHora >= :dataInicio)
            AND (:dataFim IS NULL OR a.dataHora <= :dataFim)
        """
    )
    Page<Agendamento> findWithFilters(
        @Param("clienteId") Long clienteId,
        @Param("profissionalId") Long profissionalId,
        @Param("status") StatusAgendamento status,
        @Param("dataInicio") LocalDateTime dataInicio,
        @Param("dataFim") LocalDateTime dataFim,
        Pageable pageable
    );

    // ── conflito de horário por data real ─────────────────────
    // verifica sobreposição de horário para um profissional
    // usando data_hora_inicio e data_hora_fim reais

    @Query("""
        SELECT COUNT(s) > 0
        FROM AgendamentoServico s
        WHERE s.profissional.id = :profissionalId
        AND s.agendamento.status IN ('AGENDADO', 'REAGENDADO')
        AND (:excludeId IS NULL OR s.agendamento.id <> :excludeId)
        AND s.dataHoraInicio < :dataHoraFim
        AND s.dataHoraFim > :dataHoraInicio
    """)
    boolean existeConflito(
        @Param("profissionalId") Long profissionalId,
        @Param("dataHoraInicio") LocalDateTime dataHoraInicio,
        @Param("dataHoraFim") LocalDateTime dataHoraFim,
        @Param("excludeId") Long excludeId
    );

    // ── horários ocupados em uma data para um profissional ────
    // usado pelo AgendaService para calcular slots disponíveis

    @Query("""
        SELECT s FROM AgendamentoServico s
        WHERE s.profissional.id = :profissionalId
        AND s.agendamento.status IN ('AGENDADO', 'REAGENDADO')
        AND s.dataHoraInicio >= :inicioDia
        AND s.dataHoraFim <= :fimDia
    """)
    List<AgendamentoServico> findServicosNoDia(
        @Param("profissionalId") Long profissionalId,
        @Param("inicioDia") LocalDateTime inicioDia,
        @Param("fimDia") LocalDateTime fimDia
    );

    @Query("""
        SELECT COUNT(a) > 0
        FROM Agendamento a
        WHERE a.id = :agendamentoId
        AND a.cliente.id = :clienteId
    """)
    boolean existsByIdAndClienteId(
        @Param("agendamentoId") Long agendamentoId,
        @Param("clienteId") Long clienteId
    );

    @Query("""
        SELECT COUNT(s) > 0
        FROM AgendamentoServico s
        WHERE s.agendamento.id = :agendamentoId
        AND s.profissional.id = :profissionalId
    """)
    boolean existsByIdAndProfissionalId(
        @Param("agendamentoId") Long agendamentoId,
        @Param("profissionalId") Long profissionalId
    );
}
