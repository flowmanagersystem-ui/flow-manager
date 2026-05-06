package br.edu.ifba.flowmanager.modules.servico;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ServicoRepository extends JpaRepository<Servico, Long> {
    boolean existsByNome(String nome);
    boolean existsByNomeAndIdNot(String nome, Long id);

    @Query(
        value = "SELECT s FROM Servico s WHERE " +
                "(:nome IS NULL OR LOWER(s.nome) LIKE LOWER(CONCAT('%', :nome, '%'))) AND " +
                "(:categoria IS NULL OR LOWER(s.categoria) LIKE LOWER(CONCAT('%', :categoria, '%')))",
        countQuery = "SELECT COUNT(s) FROM Servico s WHERE " +
                "(:nome IS NULL OR LOWER(s.nome) LIKE LOWER(CONCAT('%', :nome, '%'))) AND " +
                "(:categoria IS NULL OR LOWER(s.categoria) LIKE LOWER(CONCAT('%', :categoria, '%')))"
    )
    Page<Servico> findWithFilters(
        @Param("nome") String nome,
        @Param("categoria") String categoria,
        Pageable pageable
    );
}