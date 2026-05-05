package br.edu.ifba.flowmanager.modules.profissional.dto;

import br.edu.ifba.flowmanager.modules.usuario.enums.StatusUsuario;

public record ProfissionalResponseDTO(
    Long id,
    String nome,
    String sobrenome,
    String email,
    String telefone,
    String[] especialidades,
    StatusUsuario status
) {}
