package br.edu.ifba.flowmanager.auth;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.edu.ifba.flowmanager.auth.dto.CadastroRequestDTO;
import br.edu.ifba.flowmanager.auth.dto.LoginRequestDTO;
import br.edu.ifba.flowmanager.auth.dto.LoginResponseDTO;
import br.edu.ifba.flowmanager.auth.dto.UsuarioLogadoDTO;
import br.edu.ifba.flowmanager.modules.cliente.ClienteService;
import br.edu.ifba.flowmanager.modules.cliente.dto.ClienteRequestDTO;
import br.edu.ifba.flowmanager.modules.usuario.Usuario;
import br.edu.ifba.flowmanager.modules.usuario.UsuarioRepository;
import br.edu.ifba.flowmanager.modules.usuario.enums.StatusUsuario;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;
    private final TokenBlocklistService tokenBlocklistService;
    private final ClienteService clienteService;

    public LoginResponseDTO login(LoginRequestDTO dto) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(dto.email(), dto.senha())
        );

        Usuario usuario = buscarUsuarioPorEmail(dto.email());

        return montarLoginResponse(usuario);
    }

    public LoginResponseDTO refresh(String refreshToken) {
        validarTokenAtivo(refreshToken);

        if (!"refresh".equals(jwtService.extrairTipo(refreshToken))) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token inválido.");
        }

        Usuario usuario = buscarUsuarioPorEmail(jwtService.extrairEmail(refreshToken));

        if (!jwtService.tokenValido(refreshToken, usuario)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token inválido ou expirado.");
        }

        return montarLoginResponse(usuario);
    }

    public void logout(String token) {
        if (token != null && !token.isBlank()) {
            tokenBlocklistService.invalidar(token);
        }
    }

    public boolean tokenInvalidado(String token) {
        return tokenBlocklistService.tokenInvalidado(token);
    }

    public UsuarioLogadoDTO me(String email) {
        Usuario usuario = buscarUsuarioPorEmail(email);

        return new UsuarioLogadoDTO(
            usuario.getId(),
            usuario.getNome(),
            usuario.getSobrenome(),
            usuario.getEmail(),
            usuario.getPerfil()
        );
    }

    private LoginResponseDTO montarLoginResponse(Usuario usuario) {
        return new LoginResponseDTO(
            jwtService.gerarAccessToken(usuario),
            jwtService.gerarRefreshToken(usuario),
            usuario.getPerfil(),
            usuario.getNome(),
            usuario.getId()
        );
    }

    @Transactional
    public LoginResponseDTO cadastrarCliente(CadastroRequestDTO dto) {

        // reutiliza a lógica existente do ClienteService
        clienteService.create(new ClienteRequestDTO(
            null,
            dto.nome(),
            dto.sobrenome(),
            dto.email(),
            dto.telefone(),
            dto.senha(),
            StatusUsuario.Ativo
        ));

        // busca o usuário recém criado e gera o token
        Usuario usuario = buscarUsuarioPorEmail(dto.email());
        return montarLoginResponse(usuario);
    }

    private Usuario buscarUsuarioPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas."));
    }

    private void validarTokenAtivo(String token) {
        if (tokenBlocklistService.tokenInvalidado(token)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token inválido.");
        }
    }
}
