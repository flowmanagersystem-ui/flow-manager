package br.edu.ifba.flowmanager.modules.cliente.dto;

import br.edu.ifba.flowmanager.modules.usuario.enums.StatusUsuario;
import jakarta.annotation.Nonnull;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ClienteRequestUpdateDTO(
    Long id,
    @NotBlank String nome,
    @NotBlank String sobrenome,
    @NotBlank @Email String email,
    @NotBlank String telefone,
    String senha,
    @Nonnull StatusUsuario status
) {}