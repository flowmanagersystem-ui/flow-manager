package br.edu.ifba.flowmanager.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenRequestDTO(
    @NotBlank String refreshToken
) {
}
