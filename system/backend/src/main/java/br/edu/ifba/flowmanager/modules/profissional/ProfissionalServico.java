package br.edu.ifba.flowmanager.modules.profissional;

import br.edu.ifba.flowmanager.modules.servico.Servico;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "profissional_servico")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfissionalServico {

    @EmbeddedId
    private ProfissionalServicoId id;

    @ManyToOne
    @MapsId("profissionalId")
    @JoinColumn(name = "profissional_id", nullable = false)
    private Profissional profissional;

    @ManyToOne
    @MapsId("servicoId")
    @JoinColumn(name = "servico_id", nullable = false)
    private Servico servico;
}
