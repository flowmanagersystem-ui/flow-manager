package br.edu.ifba.flowmanager.modules.profissional;

import java.util.HashSet;
import java.util.Set;

import br.edu.ifba.flowmanager.modules.usuario.Usuario;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "profissional")
@Getter @Setter
public class Profissional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @OneToMany(mappedBy = "profissional", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProfissionalEspecialidade> especialidades = new HashSet<>();

    @OneToMany(mappedBy = "profissional", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProfissionalServico> servicos = new HashSet<>();
}
