package br.edu.ifba.flowmanager.modules.profissional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfissionalEspecialidadeRepository 
    extends JpaRepository<ProfissionalEspecialidade, ProfissionalEspecialidadeId> {

    void deleteByProfissionalIdAndEspecialidadeId(Long profissionalId, Long especialidadeId);
}