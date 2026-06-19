package br.edu.ifba.flowmanager.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CadastroRequestDTO(
  @NotBlank String nome,
  @NotBlank String sobrenome,
  @NotBlank @Email String email,
  @NotBlank String telefone,
  @NotBlank @Size(min = 6) String senha
) {
    
}
