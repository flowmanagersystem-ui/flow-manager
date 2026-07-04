package br.edu.ifba.flowmanager.auth.dto;

import br.edu.ifba.flowmanager.modules.usuario.enums.PerfilUsuario;

public record UsuarioLogadoDTO(
    Long id,
    String nome,
    String sobrenome,
    String email,
    PerfilUsuario perfil
) {
}
