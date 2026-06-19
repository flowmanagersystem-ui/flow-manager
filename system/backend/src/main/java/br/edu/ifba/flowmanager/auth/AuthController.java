package br.edu.ifba.flowmanager.auth;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ifba.flowmanager.auth.dto.CadastroRequestDTO;
import br.edu.ifba.flowmanager.auth.dto.LoginRequestDTO;
import br.edu.ifba.flowmanager.auth.dto.LoginResponseDTO;
import br.edu.ifba.flowmanager.auth.dto.RefreshTokenRequestDTO;
import br.edu.ifba.flowmanager.auth.dto.UsuarioLogadoDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody @Valid LoginRequestDTO dto) {
        return authService.login(dto);
    }

    @PostMapping("/refresh")
    public LoginResponseDTO refresh(@RequestBody @Valid RefreshTokenRequestDTO dto) {
        return authService.refresh(dto.refreshToken());
    }

    @PostMapping("/logout")
    public void logout(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        authService.logout(extrairToken(authHeader));
    }

    @GetMapping("/me")
    public UsuarioLogadoDTO me(org.springframework.security.core.Authentication authentication) {
        return authService.me(authentication.getName());
    }

    @PostMapping("/cadastro")
    @ResponseStatus(HttpStatus.CREATED)
    public LoginResponseDTO cadastro(@RequestBody @Valid CadastroRequestDTO dto) {
        return authService.cadastrarCliente(dto);
    }

    private String extrairToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }

        return authHeader.substring(7);
    }
}
