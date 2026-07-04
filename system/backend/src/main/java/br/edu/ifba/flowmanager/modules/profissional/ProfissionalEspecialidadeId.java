package br.edu.ifba.flowmanager.modules.profissional;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
public class ProfissionalEspecialidadeId implements Serializable {

    @Column(name = "profissional_id")
    private Long profissionalId;

    @Column(name = "especialidade_id")
    private Long especialidadeId;
}