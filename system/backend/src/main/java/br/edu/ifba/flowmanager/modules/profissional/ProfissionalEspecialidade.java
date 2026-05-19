package br.edu.ifba.flowmanager.modules.profissional;

import br.edu.ifba.flowmanager.modules.especialidade.Especialidade;
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
@Table(name = "profissional_especialidade")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfissionalEspecialidade {

    @EmbeddedId
    private ProfissionalEspecialidadeId id;

    @ManyToOne
    @MapsId("profissionalId")
    @JoinColumn(name = "profissional_id", nullable = false)
    private Profissional profissional;

    @ManyToOne
    @MapsId("especialidadeId")
    @JoinColumn(name = "especialidade_id", nullable = false)
    private Especialidade especialidade;
}