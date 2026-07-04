package br.edu.ifba.flowmanager.modules.agendamento;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AgendamentoServicoRepository 
    extends JpaRepository<AgendamentoServico, AgendamentoServicoId> {}
