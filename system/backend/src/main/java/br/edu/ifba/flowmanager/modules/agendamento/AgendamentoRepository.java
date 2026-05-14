package br.edu.ifba.flowmanager.modules.agendamento;

import java.time.LocalDateTime;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    @Query(
        value = """
            SELECT a FROM Agendamento a
            JOIN FETCH a.cliente c
            JOIN FETCH c.usuario
            LEFT JOIN FETCH a.servicos s
            WHERE (:clienteId IS NULL OR c.id = :clienteId)
            AND (:status IS NULL OR a.status = :status)
            AND (:dataInicio IS NULL OR a.dataHora >= :dataInicio)
            AND (:dataFim IS NULL OR a.dataHora <= :dataFim)
        """,
        countQuery = """
            SELECT COUNT(a) FROM Agendamento a
            JOIN a.cliente c
            WHERE (:clienteId IS NULL OR c.id = :clienteId)
            AND (:status IS NULL OR a.status = :status)
            AND (:dataInicio IS NULL OR a.dataHora >= :dataInicio)
            AND (:dataFim IS NULL OR a.dataHora <= :dataFim)
        """
    )
    Page<Agendamento> findWithFilters(
        @Param("clienteId") Long clienteId,
        @Param("status") StatusAgendamento status,
        @Param("dataInicio") LocalDateTime dataInicio,
        @Param("dataFim") LocalDateTime dataFim,
        Pageable pageable
    );

    // verifica conflito de horário para o profissional
    @Query("""
        SELECT COUNT(a) > 0 FROM Agendamento a
        JOIN a.servicos s
        WHERE s.profissional.id = :profissionalId
        AND a.status IN ('AGENDADO', 'REAGENDADO')
        AND a.dataHora = :dataHora
        AND (:excludeId IS NULL OR a.id <> :excludeId)
    """)
    boolean existeConflito(
        @Param("profissionalId") Long profissionalId,
        @Param("dataHora") LocalDateTime dataHora,
        @Param("excludeId") Long excludeId
    );
}
