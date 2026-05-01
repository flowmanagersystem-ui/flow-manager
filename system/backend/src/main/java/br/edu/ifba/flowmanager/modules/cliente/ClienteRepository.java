package br.edu.ifba.flowmanager.modules.cliente;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    
    @Query("SELECT c FROM Cliente c JOIN FETCH c.usuario")
    Page<Cliente> findAllWithUsuario(org.springframework.data.domain.Pageable pageable);
}