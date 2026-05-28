package br.edu.ifba.flowmanager.modules.agendamento;

import java.time.LocalDateTime;

import br.edu.ifba.flowmanager.modules.profissional.Profissional;
import br.edu.ifba.flowmanager.modules.servico.Servico;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "agendamento_servico")
@Getter @Setter
@NoArgsConstructor
public class AgendamentoServico {

    @EmbeddedId
    private AgendamentoServicoId id;

    @ManyToOne
    @MapsId("agendamentoId")
    @JoinColumn(name = "agendamento_id")
    private Agendamento agendamento;

    @ManyToOne
    @MapsId("profissionalId")
    @JoinColumn(name = "profissional_id", insertable = false, updatable = false)
    private Profissional profissional;

    @ManyToOne
    @MapsId("servicoId")
    @JoinColumn(name = "servico_id", insertable = false, updatable = false)
    private Servico servico;

    // ← horário específico de cada serviço dentro do agendamento
    @Column(name = "data_hora_inicio", nullable = false)
    private LocalDateTime dataHoraInicio;

    @Column(name = "data_hora_fim", nullable = false)
    private LocalDateTime dataHoraFim;
}