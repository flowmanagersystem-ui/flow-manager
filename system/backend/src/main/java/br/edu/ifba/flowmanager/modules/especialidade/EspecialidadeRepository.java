package br.edu.ifba.flowmanager.modules.especialidade;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EspecialidadeRepository extends JpaRepository<Especialidade, Long> {
    boolean existsByNome(String nome);
}
