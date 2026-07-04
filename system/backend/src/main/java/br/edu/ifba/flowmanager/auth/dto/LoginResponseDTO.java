package br.edu.ifba.flowmanager.auth.dto;

import br.edu.ifba.flowmanager.modules.usuario.enums.PerfilUsuario;

public record LoginResponseDTO(
    String accessToken,
    String refreshToken,
    PerfilUsuario perfil,
    String nome,
    Long id
) {
}
