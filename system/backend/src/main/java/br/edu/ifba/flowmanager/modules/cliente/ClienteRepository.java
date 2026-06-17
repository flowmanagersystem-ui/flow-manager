package br.edu.ifba.flowmanager.modules.cliente;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    
    @Query(
        value = "SELECT c FROM Cliente c JOIN FETCH c.usuario",
        countQuery = "SELECT COUNT(c) FROM Cliente c"
    )
    Page<Cliente> findAllWithUsuario(Pageable pageable);

    @Query(
        value = """
            SELECT c
            FROM Cliente c
            JOIN FETCH c.usuario u
            WHERE (
                :filtro IS NULL
                OR :filtro = ''
                OR LOWER(u.nome) LIKE LOWER(CONCAT('%', :filtro, '%'))
                OR LOWER(u.email) LIKE LOWER(CONCAT('%', :filtro, '%'))
                OR u.telefone LIKE CONCAT('%', :filtro, '%')
            )
            AND (:apenasAtivos = false OR u.ativo = true)
        """,
        countQuery = """
            SELECT COUNT(c)
            FROM Cliente c
            JOIN c.usuario u
            WHERE (
                :filtro IS NULL
                OR :filtro = ''
                OR LOWER(u.nome) LIKE LOWER(CONCAT('%', :filtro, '%'))
                OR LOWER(u.email) LIKE LOWER(CONCAT('%', :filtro, '%'))
                OR u.telefone LIKE CONCAT('%', :filtro, '%')
            )
            AND (:apenasAtivos = false OR u.ativo = true)
        """
    )
    Page<Cliente> findAllWithFiltro(
        @Param("filtro") String filtro,
        @Param("apenasAtivos") Boolean apenasAtivos,
        Pageable pageable
    );

    Optional<Cliente> findByUsuarioEmail(String email);
}
