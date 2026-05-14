package br.edu.ifba.flowmanager.modules.profissional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProfissionalRepository extends JpaRepository<Profissional, Long> {

    @Query(
        value = "SELECT p FROM Profissional p JOIN FETCH p.usuario",
        countQuery = "SELECT COUNT(p) FROM Profissional p" 
    )
    Page<Profissional> findAllWithUsuario(Pageable pageable);
}