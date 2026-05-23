package br.edu.ifba.flowmanager.modules.profissional;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfissionalServicoRepository 
    extends JpaRepository<ProfissionalServico, ProfissionalServicoId> {

    List<ProfissionalServico> findByProfissionalId(Long profissionalId);
    
    void deleteByProfissionalIdAndServicoId(Long profissionalId, Long servicoId);
    
    List<ProfissionalServico> findByServicoId(Long servicoId);
}