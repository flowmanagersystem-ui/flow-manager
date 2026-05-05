package br.edu.ifba.flowmanager.modules.profissional.dto;

import jakarta.annotation.Nonnull;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import br.edu.ifba.flowmanager.modules.usuario.enums.StatusUsuario;

public record ProfissionalUpdateDTO(
    @NotBlank String nome,
    @NotBlank String sobrenome,
    @NotBlank @Email String email,
    @NotBlank String telefone,
    String senha,
    @Nonnull StatusUsuario status,
    long[] especialidades
) {}
