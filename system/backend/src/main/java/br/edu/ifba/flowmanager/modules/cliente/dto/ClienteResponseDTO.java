package br.edu.ifba.flowmanager.modules.cliente.dto;

import br.edu.ifba.flowmanager.modules.usuario.enums.StatusUsuario;

public record ClienteResponseDTO(
    Long id,
    String nome,
    String sobrenome,
    String email,
    String telefone,
    StatusUsuario status
) {}
