package br.edu.ifba.flowmanager.modules.profissional;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProfissionalRepository extends JpaRepository<Profissional, Long> {
    @Query(
        value = """
            SELECT p
            FROM Profissional p
            JOIN FETCH p.usuario u
            WHERE (
                :filtro IS NULL
                OR :filtro = ''
                OR LOWER(u.nome) LIKE LOWER(CONCAT('%', :filtro, '%'))
                OR LOWER(u.email) LIKE LOWER(CONCAT('%', :filtro, '%'))
                OR u.telefone LIKE CONCAT('%', :filtro, '%')
            )
        """,
        countQuery = """
            SELECT COUNT(p)
            FROM Profissional p
            JOIN p.usuario u
            WHERE (
                :filtro IS NULL
                OR :filtro = ''
                OR LOWER(u.nome) LIKE LOWER(CONCAT('%', :filtro, '%'))
                OR LOWER(u.email) LIKE LOWER(CONCAT('%', :filtro, '%'))
                OR u.telefone LIKE CONCAT('%', :filtro, '%')
            )
        """
    )
    Page<Profissional> findAllWithFiltro(
        @Param("filtro") String filtro,
        Pageable pageable
    );

    Optional<Profissional> findByUsuarioEmail(String email);
}
