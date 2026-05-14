package br.edu.ifba.flowmanager.modules.horarioAtendimento;

import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface HorarioAtendimentoRepository 
    extends JpaRepository<HorarioAtendimento, Long> {

    List<HorarioAtendimento> findByProfissionalIdOrderByDiaSemanaAscHoraInicioAsc(Long profissionalId);

    // verifica conflito de horário no mesmo dia
    @Query("""
        SELECT COUNT(h) > 0 FROM HorarioAtendimento h
        WHERE h.profissional.id = :profissionalId
        AND h.diaSemana = :diaSemana
        AND (:excludeId IS NULL OR h.id <> :excludeId)
        AND (
            (:horaInicio >= h.horaInicio AND :horaInicio < h.horaFim)
            OR (:horaFim > h.horaInicio AND :horaFim <= h.horaFim)
            OR (:horaInicio <= h.horaInicio AND :horaFim >= h.horaFim)
        )
    """)
    boolean existeConflito(
        @Param("profissionalId") Long profissionalId,
        @Param("diaSemana") DiaSemana diaSemana,
        @Param("horaInicio") LocalTime horaInicio,
        @Param("horaFim") LocalTime horaFim,
        @Param("excludeId") Long excludeId
    );
}
