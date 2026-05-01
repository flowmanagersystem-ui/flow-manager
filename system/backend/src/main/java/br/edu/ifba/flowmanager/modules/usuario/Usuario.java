package br.edu.ifba.flowmanager.modules.usuario;

// import org.springframework.data.annotation.Id;

import br.edu.ifba.flowmanager.modules.usuario.enums.PerfilUsuario;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "usuario")
@Getter @Setter
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150, unique = true)
    private String email;

    @Column(nullable = false, length = 255)
    private String senha;

    @Column(nullable = false)
    private boolean ativo = false;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, length = 100)
    private String sobrenome;

    @Column(nullable = false, length = 20, unique = true)
    private String telefone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PerfilUsuario perfil;
}