package br.edu.ifba.flowmanager.auth;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import br.edu.ifba.flowmanager.modules.usuario.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Value("${security.jwt.secret}")
    private String jwtSecret;

    @Value("${security.jwt.access-token-expiration-ms}")
    private long accessTokenExpirationMs;

    @Value("${security.jwt.refresh-token-expiration-ms}")
    private long refreshTokenExpirationMs;

    public String gerarAccessToken(Usuario usuario) {
        return gerarToken(usuario, accessTokenExpirationMs, "access");
    }

    public String gerarRefreshToken(Usuario usuario) {
        return gerarToken(usuario, refreshTokenExpirationMs, "refresh");
    }

    public String extrairEmail(String token) {
        return extrairClaims(token).getSubject();
    }

    public String extrairTipo(String token) {
        return extrairClaims(token).get("tipo", String.class);
    }

    public boolean tokenValido(String token, Usuario usuario) {
        String email = extrairEmail(token);

        return email.equals(usuario.getEmail()) && !tokenExpirado(token);
    }

    private String gerarToken(Usuario usuario, long expiracaoMs, String tipo) {
        Date agora = new Date();
        Date expiracao = new Date(agora.getTime() + expiracaoMs);

        return Jwts.builder()
            .claims(Map.of(
                "id", usuario.getId(),
                "perfil", usuario.getPerfil().name(),
                "nome", usuario.getNome(),
                "tipo", tipo
            ))
            .subject(usuario.getEmail())
            .issuedAt(agora)
            .expiration(expiracao)
            .signWith(chaveAssinatura())
            .compact();
    }

    private boolean tokenExpirado(String token) {
        return extrairClaims(token)
            .getExpiration()
            .before(new Date());
    }

    private Claims extrairClaims(String token) {
        return Jwts.parser()
            .verifyWith(chaveAssinatura())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    private SecretKey chaveAssinatura() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }
}
