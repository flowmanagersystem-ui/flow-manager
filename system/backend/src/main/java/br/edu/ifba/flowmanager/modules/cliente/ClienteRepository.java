package br.edu.ifba.flowmanager.modules.cliente;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    
    @Query(
        value = "SELECT c FROM Cliente c JOIN FETCH c.usuario",
        countQuery = "SELECT COUNT(c) FROM Cliente c" // ← sem o JOIN FETCH
    )
    Page<Cliente> findAllWithUsuario(Pageable pageable);
}