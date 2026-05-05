package br.edu.ifba.flowmanager.modules.profissional.dto;

import jakarta.annotation.Nonnull;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import br.edu.ifba.flowmanager.modules.usuario.enums.StatusUsuario;

public record ProfissionalRequestDTO(
    Long id,
    @NotBlank String nome,
    @NotBlank String sobrenome,
    @NotBlank @Email String email,
    @NotBlank String telefone,
    @NotBlank @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres") String senha,
    @Nonnull StatusUsuario status,
    long[] especialidades
) {}
